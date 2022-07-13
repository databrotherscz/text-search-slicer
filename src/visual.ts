"use strict";

import powerbi from "powerbi-visuals-api";
import VisualComponent, { updateVisualComponentState, ITextSearchSlicerState } from "./components/TextSearchSlicer";
import * as React from "react";
import * as ReactDOM from "react-dom";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { VisualSettings } from "./settings";
import FilterService from "./services/filterService";
import { IAdvancedFilter, IFilterColumnTarget } from "powerbi-models";

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    private reactRoot: React.FunctionComponentElement<any>;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.reactRoot = React.createElement(VisualComponent, {
            filterService: new FilterService(options.host),
        });
        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        
        this.tryUpdateVisualComponentState(options);
    }

    private tryUpdateVisualComponentState(options: VisualUpdateOptions) {        
        const updateType = options.type.valueOf();

        let newState: ITextSearchSlicerState = {
            isLoaded: true,
            // minus outer border and margin
            height: options.viewport.height - 2 - 5,
            width: options.viewport.width - 2 - 10,
            settings: this.settings
        };

        if (updateType === 254 || updateType === 2 || updateType === 62) {
            const categories = options.dataViews[0].categorical?.categories;
            const filter = options.jsonFilters && options.jsonFilters[0] as IAdvancedFilter;
            const currentFilterValue = filter && filter.conditions[0].value?.toString() || "";
            const currentFilterTarget = filter && filter.target as IFilterColumnTarget;
            
            newState.currentFilterValue = currentFilterValue;
            if (currentFilterValue) {
                newState.inputText = currentFilterValue;
            }
            newState.targets = [];
            
            if (categories) {
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    const target = {
                        table: category.source.queryName.substring(0, category.source.queryName.indexOf(".")),
                        column: category.source.displayName,
                    };
                    newState.targets.push(target);

                    if (currentFilterTarget && currentFilterTarget.table === target.table && currentFilterTarget.column === target.column) {
                        newState.currentFilterTargetIndex = i;
                        newState.currentTargetIndex = i;
                    }
                }
            }
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

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
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