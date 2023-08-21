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

/*
"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

class VisualSettings extends DataViewObjectsParser {
    public generalFormatting: GeneralFormatting = new GeneralFormatting();
    public inputFormatting: InputFormatting = new InputFormatting();
    public inputActionFormatting: InputActionFormatting = new InputActionFormatting();
    public targetFormatting: TargetFormatting = new TargetFormatting();
}

class GeneralFormatting {
    public fontSize: number = 8;
    public fontFamily: string = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
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

class InputActionFormatting {
    public fontColor: string = "#b3b3b3"; 
    public hoverFontColor: string = "#808080";
    public activeFontColor: string = "#333333"; 
}

class TargetFormatting {
    public fontColor: string = "#1d1d1b";
    public backgroundColor: string = "#eeeeee";
    public hoverFontColor: string = "#1d1d1b";
    public hoverBackgroundColor: string = "#d1d1d1"; 
    public activeFontColor: string = "#1d1d1b"; 
    public activeBackgroundColor: string = "#bbbbbb";
    public padding: number = 4; 
    public borderRadius: number = 0; 
}

export {
    VisualSettings,
};
*/

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsModel = formattingSettings.Model;
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;

export class GeneralFormattingCard extends FormattingSettingsCard {

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font size",
        value: 8
    });

    public fontFamily =  new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font family",
        value: "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif"
    });

    name: string = "generalFormatting";
    displayName: string = "General";
    slices: FormattingSettingsSlice[] = [this.fontSize, this.fontFamily];
}

export class InputFormattingCard extends FormattingSettingsCard {

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font color",
        value: {
            value: "#333333"
        }
    });

    public backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background color",
        value: {
            value: "#ffffff"
        }
    });

    public padding =  new formattingSettings.NumUpDown({
        name: "padding",
        displayName: "Padding",
        value: 4
    });

    public borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Border color",
        value: {
            value: "#eaeaea"
        }
    });

    public borderThickness = new formattingSettings.NumUpDown({
        name: "borderThickness",
        displayName: "Border thickness",
        value: 1
    });

    public borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Border radius",
        value: 0
    });

    public placeholderFontColor = new formattingSettings.ColorPicker({
        name: "placeholderFontColor",
        displayName: "Placeholder font color",
        value: {
            value: "#b3b3b3"
        }
    });

    public placeholderString = new formattingSettings.TextInput({
        name: "placeholderString",
        displayName: "Placeholder string",
        value: "Search",
        placeholder: "Search"
    });

    name: string = "inputFormatting";
    displayName: string = "Input field";
    slices: FormattingSettingsSlice[] = [
        this.fontColor, 
        this.backgroundColor,
        this.padding,
        this.borderColor,
        this.borderThickness,
        this.borderRadius,
        this.placeholderFontColor,
        this.placeholderString
    ];
}

export class InputActionFormattingCard extends FormattingSettingsCard {

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font color",
        value: {
            value: "#b3b3b3"
        }
    });

    public hoverFontColor = new formattingSettings.ColorPicker({
        name: "hoverFontColor",
        displayName: "Hover font color",
        value: {
            value: "#808080"
        }
    });

    public activeFontColor = new formattingSettings.ColorPicker({
        name: "activeFontColor",
        displayName: "Active font color",
        value: {
            value: "#333333"
        }
    });

    name: string = "inputActionFormatting";
    displayName: string = "Input field action";
    slices: FormattingSettingsSlice[] = [
        this.fontColor,
        this.hoverFontColor,
        this.activeFontColor
    ];
}

export class TargetFormattingCard extends FormattingSettingsCard {

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font color",
        value: {
            value: "#1d1d1b"
        }
    });

    public backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background color",
        value: {
            value: "#eeeeee"
        }
    });

    public hoverFontColor = new formattingSettings.ColorPicker({
        name: "hoverFontColor",
        displayName: "Hover font color",
        value: {
            value: "#1d1d1b"
        }
    });

    public hoverBackgroundColor = new formattingSettings.ColorPicker({
        name: "hoverBackgroundColor",
        displayName: "Hover background color",
        value: {
            value: "#d1d1d1"
        }
    });

    public activeFontColor = new formattingSettings.ColorPicker({
        name: "activeFontColor",
        displayName: "Active font color",
        value: {
            value: "#1d1d1b"
        }
    });

    public activeBackgroundColor = new formattingSettings.ColorPicker({
        name: "activeBackgroundColor",
        displayName: "Active background color",
        value: {
            value: "#bbbbbb"
        }
    });

    public padding =  new formattingSettings.NumUpDown({
        name: "padding",
        displayName: "Padding",
        value: 4
    });

    public borderRadius =  new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Border radius",
        value: 0
    });


    name: string = "targetFormatting";
    displayName: string = "Field selection";
    slices: FormattingSettingsSlice[] = [
        this.fontColor,
        this.backgroundColor,
        this.hoverFontColor,
        this.hoverBackgroundColor,
        this.activeFontColor,
        this.activeBackgroundColor,
        this.padding,
        this.borderRadius
    ];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    public generalCard: GeneralFormattingCard = new GeneralFormattingCard();
    public inputCard: InputFormattingCard = new InputFormattingCard();
    public inputActionCard: InputActionFormattingCard = new InputActionFormattingCard();
    public targetCard: TargetFormattingCard = new TargetFormattingCard();

    cards: FormattingSettingsCard[] = [
        this.generalCard,
        this.inputCard,
        this.inputActionCard,
        this.targetCard
    ];
}