"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public formatting: formattingSettings = new formattingSettings();
}

export class formattingSettings {
    public fontColor: string = "#252423";
    public fontSize: number = 10;
    public fontFamily: string = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
    public fill: string = "#ffffff";
    public padding: number = 5;
}