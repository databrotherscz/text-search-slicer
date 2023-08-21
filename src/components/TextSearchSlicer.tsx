
import ITextSearchSlicerTarget from "../models/ITextSearchSlicerTarget";
import * as React from "react";
import TextSearchFilterService from "../services/textSearchFilterService";
import { VisualFormattingSettingsModel } from "../settings";
import "../style/TextSearchSlicer.css";
import { CrossIcon, SearchIcon } from "./InputButtonIcons";
import NoFieldsPlaceholder from "./NoFieldsPlaceholder";
import { pixelConverter as PixelConverter } from "powerbi-visuals-utils-typeutils";

// -------------------- TYPES --------------------

interface ITextSearchSlicerState {
    isLoaded?: boolean,
    width?: number,
    height?: number,
    formattingSettings?: VisualFormattingSettingsModel,
    inputText?: string,
    targets?: ITextSearchSlicerTarget[],
    currentTargetIndex?: number,
    currentFilterValue?: string,
    currentFilterTargetIndex?: number
}

type UpdateVisualComponent = (newState: ITextSearchSlicerState) => void;

interface ITextSearchSlicerProps {
    textSearchFilterService: TextSearchFilterService,
}

// -------------------- IMPLEMENTATION --------------------

const initialState: ITextSearchSlicerState = {
    isLoaded: false,
    width: 10,
    height: 10,
    formattingSettings: null,

    inputText: null,
    // all columns
    targets: [],
    // index of selected column
    currentTargetIndex: 0,

    // value of applied filter 
    currentFilterValue: null,
    // target index of applied filter
    currentFilterTargetIndex: null
};


class TextSearchSlicer extends React.Component<ITextSearchSlicerProps, ITextSearchSlicerState> {
    private static updateCallback: UpdateVisualComponent = null;

    public static update(newState: ITextSearchSlicerState) {
        if (typeof TextSearchSlicer.updateCallback === 'function') {
            TextSearchSlicer.updateCallback(newState);
        }
    }

    constructor(props: ITextSearchSlicerProps) {
        super(props);
        this.state = initialState;

        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
        this.onClearButtonClick = this.onClearButtonClick.bind(this);
        this.onTextInputKeyDown = this.onTextInputKeyDown.bind(this);
        this.onTextInputBlur = this.onTextInputBlur.bind(this);
        this.onTargetButtonClick = this.onTargetButtonClick.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    public componentWillMount() {
        TextSearchSlicer.updateCallback = (newState: ITextSearchSlicerState): void => {
            this.setState(prevState => ({
                ...prevState,
                ...newState,
                // set selected target index if it is present in newState otherwise check if previous index is in bound and possibly set to 0
                currentTargetIndex: (newState.currentTargetIndex === null || newState.currentTargetIndex === undefined) ?
                    (((newState.targets === null || newState.targets === undefined) || (prevState.currentTargetIndex <= newState.targets.length - 1)) ? prevState.currentTargetIndex : 0)
                    :
                    newState.currentTargetIndex
            }));
        };
    }

    public componentWillUnmount() {
        TextSearchSlicer.updateCallback = null;
    }

    private onTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            inputText: e.target.value
        });
    }

    private onSearchButtonClick() {
        this.applyFilter();
    }

    private onClearButtonClick() {
        this.setState({
            inputText: ""
        });
        this.props.textSearchFilterService.clearFilter();
    }

    private onTextInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {     
        if (e.key === "Enter") {
            this.applyFilter();
        }
    }

    private onTextInputBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
        if (!e.relatedTarget || (!e.relatedTarget.classList.contains("input-button") && !e.relatedTarget.classList.contains("target-button"))) {
            this.setState(prevState => ({
                inputText: prevState.currentFilterValue || ""
            }));
        }
    }

    private onTargetButtonClick(selectedIndex: number) {
        this.setState({
            currentTargetIndex: selectedIndex
        });

        this.applyFilter(selectedIndex);
    }

    private applyFilter(newTargetIndex: number = null) {
        const targetIndex = newTargetIndex === null ? this.state.currentTargetIndex : newTargetIndex;

        if (this.state.inputText) {
            this.props.textSearchFilterService.setFilter(this.state.inputText, this.state.targets[targetIndex]);
        }
        else {
            this.props.textSearchFilterService.clearFilter();
        }
    }

    private getInputFieldPadding(padding: number): string {
        return `${padding + 1}px ${padding + 1}px ${padding - 1}px ${padding + 1}px`;
    }

    private getTargetButtonPadding(padding: number): string {
        return `${padding}px ${padding + 5}px ${padding}px ${padding + 5}px`;
    }

    // PBI font size formatting is not in pure CSS px units, need to convert
    private getPbiFontSize(value: number): string {
        return `${value * (4 / 3)}px`;
    }

    render() {
        const bodyCss = `
            :root {
                --visualHeight: ${this.state.height}px;
                --visualWidth: ${this.state.width}px;
                --fontFamily: ${this.state.formattingSettings?.generalCard?.fontFamily.value};
                --fontSize: ${PixelConverter.fromPointToPixel(this.state.formattingSettings?.generalCard?.fontSize.value)}px;
                
                --inputFieldFontColor: ${this.state.formattingSettings?.inputCard?.fontColor.value.value};
                --inputFieldBackgroundColor: ${this.state.formattingSettings?.inputCard?.backgroundColor.value.value};
                --inputFieldPadding: ${this.getInputFieldPadding(this.state.formattingSettings?.inputCard?.padding.value)};
                --inputFieldBorderColor: ${this.state.formattingSettings?.inputCard?.borderColor.value.value};
                --inputFieldBorderThickness: ${this.state.formattingSettings?.inputCard?.borderThickness.value}px;
                --inputFieldBorderRadius: ${this.state.formattingSettings?.inputCard?.borderRadius.value}px;
                
                --placeholderFontColor: ${this.state.formattingSettings?.inputCard?.placeholderFontColor.value.value};

                --inputActionFontColor: ${this.state.formattingSettings?.inputActionCard?.fontColor.value.value};
                --inputActionHoverFontColor: ${this.state.formattingSettings?.inputActionCard?.hoverFontColor.value.value};
                --inputActionActiveFontColor: ${this.state.formattingSettings?.inputActionCard?.activeFontColor.value.value};

                --targetButtonBorderRadius: ${this.state.formattingSettings?.targetCard?.borderRadius.value}px;
                --targetButtonPadding: ${this.getTargetButtonPadding(this.state.formattingSettings?.targetCard?.padding.value)};
                
                --targetButtonFontColor: ${this.state.formattingSettings?.targetCard?.fontColor.value.value};
                --targetButtonBackgroundColor: ${this.state.formattingSettings?.targetCard?.backgroundColor.value.value};

                --targetButtonHoverFontColor: ${this.state.formattingSettings?.targetCard?.hoverFontColor.value.value};
                --targetButtonHoverBackgroundColor: ${this.state.formattingSettings?.targetCard?.hoverBackgroundColor.value.value};

                --targetButtonActiveFontColor: ${this.state.formattingSettings?.targetCard?.activeFontColor.value.value};
                --targetButtonActiveBackgroundColor: ${this.state.formattingSettings?.targetCard?.activeBackgroundColor.value.value};
            }
        `;

        return (
            <>
                <style> {bodyCss} </style>
                {
                    (this.state.isLoaded) ? (
                        <div className="visual-container">
                            {
                                (this.state.targets && this.state.targets.length > 0) ? (
                                    <>
                                        <div className="input-container">
                                            <input
                                                className="input-field"
                                                placeholder={this.state.formattingSettings?.inputCard?.placeholderString.value}
                                                type="text"
                                                value={this.state.inputText}
                                                onChange={this.onTextInputChange}
                                                onKeyDown={this.onTextInputKeyDown}
                                                onBlur={this.onTextInputBlur} />
                                            <button className="input-button" onClick={this.onSearchButtonClick}>
                                                <SearchIcon></SearchIcon >
                                            </button>
                                            <button className="input-button" onClick={this.onClearButtonClick}>
                                                <CrossIcon></CrossIcon >
                                            </button>
                                        </div>

                                        {
                                            (this.state.targets.length > 1) ? (
                                                <div className="target-container">
                                                    {this.state.targets.map((target, targetIndex) => (
                                                        <button className={`target-button ${this.state.currentTargetIndex == targetIndex ? "target-button__active" : ""}`} onClick={() => this.onTargetButtonClick(targetIndex)}>
                                                            {target.displayName}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                null
                                            )
                                        }
                                    </>
                                ) : (
                                    <NoFieldsPlaceholder></NoFieldsPlaceholder>
                                )
                            }
                        </div>
                    ) : (
                        null
                    )
                }
            </>
        );
    }
}

export default TextSearchSlicer;
export {
    ITextSearchSlicerState
};