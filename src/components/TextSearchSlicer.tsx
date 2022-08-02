import { IFilterColumnTarget } from "powerbi-models";
import * as React from "react";
import TextSearchFilterService from "../services/textSearchFilterService";
import { VisualSettings } from "../settings";
import "../style/TextSearchSlicer.css";
import { CrossIcon, SearchIcon } from "./InputButtonIcons";
import NoFieldsPlaceholder from "./NoFieldsPlaceholder";

// -------------------- TYPES --------------------

interface ITextSearchSlicerState {
    isLoaded?: boolean,
    width?: number,
    height?: number,
    settings?: VisualSettings,
    inputText?: string,
    targets?: IFilterColumnTarget[],
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
    settings: null,

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
    };

    private onClearButtonClick() {
        this.setState({
            inputText: ""
        });
        this.props.textSearchFilterService.clearFilter();
    };

    private onTextInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            this.applyFilter();
        }
    };

    private onTextInputBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
        if (!e.relatedTarget || (!e.relatedTarget.classList.contains("input-button") && !e.relatedTarget.classList.contains("target-button"))) {
            this.setState(prevState => ({
                inputText: prevState.currentFilterValue || ""
            }));
        }
    };

    private onTargetButtonClick(selectedIndex: number) {
        this.setState({
            currentTargetIndex: selectedIndex
        });

        this.applyFilter(selectedIndex);
    };

    private applyFilter(newTargetIndex: number = null) {
        const targetIndex = newTargetIndex === null ? this.state.currentTargetIndex : newTargetIndex;

        if (this.state.inputText) {
            this.props.textSearchFilterService.setFilter(this.state.inputText, this.state.targets[targetIndex]);
        }
        else {
            this.props.textSearchFilterService.clearFilter();
        }
    };

    private getInputFieldPadding(padding: number): string {
        return `${padding + 1}px ${padding + 1}px ${padding - 1}px ${padding + 1}px`;
    }

    private getTargetButtonPadding(padding: number): string {
        return `${padding}px ${padding + 5}px ${padding}px ${padding + 5}px`;
    }

    // PBI font size formatting is not in pure CSS px units, need to convert
    private getPbiFontSize(value: number): string {
        return  `${value * (4/3)}px`;
    }

    render() {
        const inputButtonStyle: React.CSSProperties = {
            borderRadius: this.state.settings?.inputFormatting?.borderRadius - this.state.settings?.inputFormatting?.borderThickness
        };
    
        const bodyCss = `
            :root {
                --visualHeight: ${this.state.height}px;
                --visualWidth: ${this.state.width}px;
                --fontFamily: ${this.state.settings?.generalFormatting?.fontFamily};
                --fontSize: ${this.getPbiFontSize(this.state.settings?.generalFormatting?.fontSize)};
                
                --inputFieldFontColor: ${this.state.settings?.inputFormatting?.fontColor};
                --inputFieldBackgroundColor: ${this.state.settings?.inputFormatting?.backgroundColor};
                --inputFieldPadding: ${this.getInputFieldPadding(this.state.settings?.inputFormatting?.padding)};
                --inputFieldBorderColor: ${this.state.settings?.inputFormatting?.borderColor};
                --inputFieldBorderThickness: ${this.state.settings?.inputFormatting?.borderThickness}px;
                --inputFieldBorderRadius: ${this.state.settings?.inputFormatting?.borderRadius}px;
                
                --placeholderFontColor: ${this.state.settings?.inputFormatting?.placeholderFontColor};

                --inputActionFontColor: ${this.state.settings?.inputActionFormatting?.fontColor};
                --inputActionBackgroundColor: ${this.state.settings?.inputActionFormatting?.backgroundColor};

                --inputActionHoverFontColor: ${this.state.settings?.inputActionFormatting?.hoverFontColor};
                --inputActionHoverBackgroundColor: ${this.state.settings?.inputActionFormatting?.hoverBackgroundColor};

                --inputActionActiveFontColor: ${this.state.settings?.inputActionFormatting?.activeFontColor};
                --inputActionActiveBackgroundColor: ${this.state.settings?.inputActionFormatting?.activeBackgroundColor};
                
                --inputActionBorderRadius: ${this.state.settings?.inputActionFormatting?.borderRadius}px;


                --targetButtonBorderRadius: ${this.state.settings?.targetFormatting?.borderRadius}px;
                --targetButtonPadding: ${this.getTargetButtonPadding(this.state.settings?.targetFormatting?.padding)};
                
                --targetButtonFontColor: ${this.state.settings?.targetFormatting?.fontColor};
                --targetButtonBackgroundColor: ${this.state.settings?.targetFormatting?.backgroundColor};

                --targetButtonHoverFontColor: ${this.state.settings?.targetFormatting?.hoverFontColor};
                --targetButtonHoverBackgroundColor: ${this.state.settings?.targetFormatting?.hoverBackgroundColor};

                --targetButtonActiveFontColor: ${this.state.settings?.targetFormatting?.activeFontColor};
                --targetButtonActiveBackgroundColor: ${this.state.settings?.targetFormatting?.activeBackgroundColor};
            }
        `;

        return(
            this.state.isLoaded? (
                <div className="visual-container">
                    {
                        (this.state.targets && this.state.targets.length > 0) ? (
                            <>
                                <style> {bodyCss} </style>
                                <div className="input-container">
                                    <input
                                        className="input-field"
                                        placeholder={this.state.settings?.inputFormatting?.placeholderString}
                                        type="text"
                                        value={this.state.inputText}
                                        onChange={this.onTextInputChange}
                                        onKeyDown={this.onTextInputKeyDown}
                                        onBlur={this.onTextInputBlur} />
                                    <button className="input-button" style={inputButtonStyle} onClick={this.onSearchButtonClick}>
                                        <SearchIcon></SearchIcon >
                                    </button>
                                    <button className="input-button" style={inputButtonStyle} onClick={this.onClearButtonClick}>
                                        <CrossIcon></CrossIcon >
                                    </button>
                                </div>
    
                                {
                                    (this.state.targets.length > 1) ? (
                                        <div className="target-container">
                                            {this.state.targets.map((target, targetIndex) => (
                                                <button className={`target-button ${this.state.currentTargetIndex == targetIndex ? "target-button__active" : ""}`} onClick={() => this.onTargetButtonClick(targetIndex)}>
                                                    {target.column}
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
        );
    }


}

export default TextSearchSlicer;
export {
    ITextSearchSlicerState
};