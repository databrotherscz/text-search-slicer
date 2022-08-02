import { IFilterColumnTarget } from "powerbi-models";
import * as React from "react";
import TextSearchFilterService from "../services/textSearchFilterService";
import { VisualSettings } from "../settings";
import "../style/TextSearchSlicer.css";
import { CrossIcon, SearchIcon } from "./Icons";
import { convertFontSize, convertPadding } from "../helpers/utils";

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

    render() {
        const inputFieldStyle: React.CSSProperties = {
            paddingTop: convertPadding(this.state.settings?.inputFormatting?.padding + 1),
            paddingLeft: convertPadding(this.state.settings?.inputFormatting?.padding + 1),
            paddingRight: convertPadding(this.state.settings?.inputFormatting?.padding + 1),
            paddingBottom: convertPadding(this.state.settings?.inputFormatting?.padding - 1)
        };

        const inputContainerStyle: React.CSSProperties = {
            background: this.state.settings?.inputFormatting?.backgroundColor,
            borderWidth: this.state.settings?.inputFormatting?.borderThickness,
            borderColor: this.state.settings?.inputFormatting?.borderColor,
            borderRadius: this.state.settings?.inputFormatting?.borderRadius
        };

        const inputButtonStyle: React.CSSProperties = {
            borderRadius: this.state.settings?.inputFormatting?.borderRadius - this.state.settings?.inputFormatting?.borderThickness
        };

        const targetButtonStyle: React.CSSProperties = {
            borderRadius: this.state.settings?.targetFormatting?.borderRadius,
            color: this.state.settings?.targetFormatting?.fontColor,

            paddingTop: convertPadding(this.state.settings?.targetFormatting?.padding),
            paddingLeft: convertPadding(this.state.settings?.targetFormatting?.padding + 5),
            paddingRight: convertPadding(this.state.settings?.targetFormatting?.padding + 5),
            paddingBottom: convertPadding(this.state.settings?.targetFormatting?.padding),
        };
    
        const bodyCss = `
            :root {
                --visualHeight: ${this.state.height};
                --visualWidth: ${this.state.width};
                --primaryFontFamily: ${this.state.settings?.generalFormatting?.fontFamily};
                --inputFieldFontColor: ${this.state.settings?.inputFormatting?.fontColor};
                
                --fontSize: ${convertFontSize(this.state.settings?.generalFormatting?.fontSize)};
                --placeholderFontColor: ${this.state.settings?.inputFormatting?.placeholderFontColor};

                --testColVar2: ${this.state.settings?.targetFormatting?.hoverBackgroundColor};
            }

        `;

        return(
            this.state.isLoaded? (
                <div className="visual-container">
                    {
                        (this.state.targets && this.state.targets.length > 0) ? (
                            <>
                                <style> {bodyCss} </style>
                                <div className="input-container" style={inputContainerStyle}>
                                    <input
                                        className="input-field"
                                        style={inputFieldStyle}
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
                                                <button style={targetButtonStyle} className={`target-button ${this.state.currentTargetIndex == targetIndex ? "target-button__active" : ""}`} onClick={() => this.onTargetButtonClick(targetIndex)}>
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
                            <div>
                                {this.state.settings?.generalFormatting?.notSelectedString}
                            </div>
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