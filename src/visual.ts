/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import powerbi from "powerbi-visuals-api";
import TextSearchSlicer, { ITextSearchSlicerState } from "./components/TextSearchSlicer";
import * as React from "react";
import * as ReactDOM from "react-dom";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import { VisualFormattingSettingsModel } from "./settings";
import TextSearchFilterService from "./services/textSearchFilterService";
import { IAdvancedFilter, IFilterColumnTarget } from "powerbi-models";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

class Visual implements IVisual {
    private target: HTMLElement;
    
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private reactRoot: React.ComponentElement<any, any>;

    private selectionManager: ISelectionManager;
    private eventService: IVisualEventService;

    constructor(options: VisualConstructorOptions) {
        console.log("Visual constructor", options);
        
        this.selectionManager = options.host.createSelectionManager();
        this.eventService = options.host.eventService;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.registerContextMenuHandler();
        
        this.reactRoot = React.createElement(TextSearchSlicer, {
            textSearchFilterService: new TextSearchFilterService(options.host)
        });
        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        this.eventService.renderingStarted(options);
        
        console.log('Visual update', options);
        
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);
        
        const newState = this.getUpdatedVisualState(options);
        TextSearchSlicer.update(newState);

        this.eventService.renderingFinished(options);
    }

    private getUpdatedVisualState(options: VisualUpdateOptions): ITextSearchSlicerState {
        const categories = options.dataViews[0].categorical?.categories;
        const filter = options.jsonFilters && options.jsonFilters[0] as IAdvancedFilter;
        const currentFilterValue = filter && filter.conditions[0].value?.toString() || "";
        const currentFilterTarget = filter && filter.target as IFilterColumnTarget;

        const newState: ITextSearchSlicerState = {
            isLoaded: true,
            height: options.viewport.height - 5,
            width: options.viewport.width - 10,
            formattingSettings: this.formattingSettings,
            currentFilterValue: currentFilterValue,
            inputText: currentFilterValue,
            targets: []
        };
            
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                const queryNameSeparatorIndex = category.source.queryName.indexOf(".");
                const target = {
                    table: category.source.queryName.substring(0, queryNameSeparatorIndex),
                    column: category.source.queryName.substring(queryNameSeparatorIndex + 1),
                    displayName: category.source.displayName
                };
                newState.targets.push(target);

                // if iterated target is currently filtred
                if (currentFilterTarget && currentFilterTarget.table === target.table && currentFilterTarget.column === target.column) {
                    newState.currentFilterTargetIndex = i;
                    newState.currentTargetIndex = i;
                }
            }
        }

        return newState;
    }

    private registerContextMenuHandler() {
        this.target.addEventListener("contextmenu", e => {
            const emptySelection = {
                "measures": [],
                "dataMap": {}
            };
            this.selectionManager.showContextMenu(
                emptySelection, {
                    x: e.clientX,
                    y: e.clientY
                });
            e.preventDefault();
        });
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}

export {
    Visual
};