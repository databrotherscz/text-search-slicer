"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public slicerRormatting: slicerFormattingSettings = new slicerFormattingSettings();
}

export class slicerFormattingSettings {
    public inputFontColor: string = "#333333";
    public placeholderFontColor: string = "#b3b3b3";
    public fontSize: number = 8;
    public fontFamily: string = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
    public fill: string = "#ffffff";
    public padding: number = 4;
    public placeholderString: string = "Search";
    public notSelectedString: string = "No fields selected";
}