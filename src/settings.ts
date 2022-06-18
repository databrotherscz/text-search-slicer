"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public formatting: formattingSettings = new formattingSettings();
}

export class formattingSettings {
    public fontColor: string = "#000000";
    public fontSize: number = 8;
    public fontFamily: string = "Calibri";
    public fill: string = "#ffffff";
    public padding: number = 0;
}