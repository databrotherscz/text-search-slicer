"use strict";

import powerbi from "powerbi-visuals-api";
import VisualComponent, { updateVisualComponentState, ITextSearchSlicerState } from "./components/TextSearchSlicer";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualUpdateType = powerbi.VisualUpdateType;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { VisualSettings } from "./settings";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import FilterService from "./services/filterService";
import { IAdvancedFilter, IFilterColumnTarget } from "powerbi-models";

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private settings: VisualSettings;
    private filterService: FilterService;

    private reactRoot: React.FunctionComponentElement<any>;

    constructor(options: VisualConstructorOptions) {
        console.log("Visual constructor", options);

        this.target = options.element;
        this.host = options.host;
        this.filterService = new FilterService(this.host);

        this.reactRoot = React.createElement(VisualComponent, {
            filterService: this.filterService,
        });
        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        console.log("Visual update", options);
        
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log(this.settings);
        
        this.tryUpdateVisualComponentState(options);
        
        
        
        // TODO: handle existing filter
        // need to know: target, value
        
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    private tryUpdateVisualComponentState(options: VisualUpdateOptions) {
        const updateType = options.type;
        let newState: ITextSearchSlicerState = {
            height: options.viewport.height,
            width: options.viewport.width,
            isLoaded: true
        };

        if (updateType === VisualUpdateType.Style) {
            newState.settings = this.settings;
        }
        else if (updateType !== VisualUpdateType.Resize && updateType !== VisualUpdateType.ResizeEnd && updateType !== VisualUpdateType.ViewMode) {
            const categories = options.dataViews[0].categorical?.categories;
            if (categories) {
                newState.targets = [];
                for (const category of categories) {
                    newState.targets.push({
                        table: category.source.queryName.substring(0, category.source.queryName.indexOf(".")),
                        column: category.source.displayName,
                    });
                }
            }

            const filter = options.jsonFilters && options.jsonFilters[0] as IAdvancedFilter;
            const filterValue = filter && filter.conditions[0].value?.toString() || "";
            newState.inputText = filterValue;
            newState.currentFilterValue = filterValue;
        }

        const updateFunction = () => {
            if (updateVisualComponentState) {
                updateVisualComponentState(newState);
                return true;
            }
            return false;
        };

        // if update function was not called, try again with delay 
        // workaround - visual.update is slightly faster than mounting root component
        if (!updateFunction()) {
            setTimeout(updateFunction, 100);
        }
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(
            this.settings || VisualSettings.getDefault(),
            options
        );
    }
}