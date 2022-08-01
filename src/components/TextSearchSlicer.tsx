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
        const visualContainerStyle: React.CSSProperties = {
            width: this.state.width,
            height: this.state.height,
            fontFamily: this.state.settings?.slicerFormatting?.fontFamily,
            color: this.state.settings?.slicerFormatting?.inputFontColor,
            fontSize: convertFontSize(this.state.settings?.slicerFormatting?.fontSize)
        };

        const inputFieldStyle: React.CSSProperties = {
            paddingTop: convertPadding(this.state.settings?.slicerFormatting?.padding + 1),
            paddingLeft: convertPadding(this.state.settings?.slicerFormatting?.padding + 1),
            paddingRight: convertPadding(this.state.settings?.slicerFormatting?.padding + 1),
            paddingBottom: convertPadding(this.state.settings?.slicerFormatting?.padding - 1)
        };
    
        const inputPlaceholderCss = `
            ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
                color: ${this.state.settings?.slicerFormatting?.placeholderFontColor};
                opacity: 1; /* Firefox */
            }
    
            :-ms-input-placeholder { /* Internet Explorer 10-11 */
                color: ${this.state.settings?.slicerFormatting?.placeholderFontColor};
            }
    
            ::-ms-input-placeholder { /* Microsoft Edge */
                color: ${this.state.settings?.slicerFormatting?.placeholderFontColor};
            }
        `;

        return(
            this.state.isLoaded? (
                <div className="visual-container" style={visualContainerStyle}>
                    {
                        (this.state.targets && this.state.targets.length > 0) ? (
                            <>
                                <style> {inputPlaceholderCss} </style>
                                <div className="input-container" style={{ background: this.state.settings?.slicerFormatting?.fill }}>
                                    <input
                                        className="input-field"
                                        style={inputFieldStyle}
                                        placeholder={this.state.settings?.slicerFormatting?.placeholderString}
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
                                {this.state.settings?.slicerFormatting?.notSelectedString}
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