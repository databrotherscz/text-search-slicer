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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

class VisualSettings extends DataViewObjectsParser {
    public generalFormatting: GeneralFormatting = new GeneralFormatting();
    public inputFormatting: InputFormatting = new InputFormatting();
    public targetFormatting: TargetFormatting = new TargetFormatting();
}

class GeneralFormatting {
    public fontSize: number = 8;
    public fontFamily: string = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
    public notSelectedString: string = "No fields selected";
}

class InputFormatting {
    public fontColor: string = "#333333";
    public backgroundColor: string = "#ffffff";
    public padding: number = 4;
    public borderColor: string = "#eaeaea";
    public borderThickness: number = 1;
    public borderRadius: number = 0;
    public placeholderFontColor: string = "#b3b3b3";
    public placeholderString: string = "Search";
}

class TargetFormatting {
    public fontColor: string = "#1d1d1b"; // xxx 
    public backgroundColor: string = "#eeeeee"; // xxx
    public hoverFontColor: string = "#1d1d1b"; // xxx
    public hoverBackgroundColor: string = "#d1d1d1"; // xxx
    public activeFontColor: string = "#1d1d1b"; // xxx
    public activeBackgroundColor: string = "#bbbbbb"; // xxx
    public padding: number = 4; // xxx
    public borderRadius: number = 0; // xxx
}

export {
    VisualSettings,
};