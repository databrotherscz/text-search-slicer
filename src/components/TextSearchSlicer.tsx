import { IFilterColumnTarget } from "powerbi-models";
import * as React from "react";
import { useEffect, useState } from "react";
import TextSearchFilterService from "../services/textSearchFilterService";
import { VisualSettings } from "../settings";
import powerbi from "powerbi-visuals-api";
import "../style/TextSearchSlicer.css";
import { CrossIcon, SearchIcon } from "./Icons";
import { convertFontSize } from "../helpers/utils";

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

let updateVisualComponentState: UpdateVisualComponent = null;

function TextSearchSlicer(props: ITextSearchSlicerProps) {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        updateVisualComponentState = (newState) => {
            setState(prevState => ({
                ...prevState,
                ...newState,
                // set selected target index if it is present in newState otherwise check if previous index is in bound and possibly set to 0
                currentTargetIndex: (newState.currentTargetIndex === null || newState.currentTargetIndex === undefined) ?
                    (((newState.targets === null || newState.targets === undefined) || (prevState.currentTargetIndex <= newState.targets.length - 1)) ? prevState.currentTargetIndex : 0)
                    :
                    newState.currentTargetIndex
            }));
        };

        return () => {
            updateVisualComponentState = null;
        };
    }, []);

    const onTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            inputText: e.target.value
        });
    };

    const onSearchButtonClick = () => {
        applyFilter();
    };

    const onClearButtonClick = () => {
        setState({
            ...state,
            inputText: ""
        });
        props.textSearchFilterService.clearFilter();
    };

    const onTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            applyFilter();
        }
    };

    const onTextInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (!e.relatedTarget || (!e.relatedTarget.classList.contains("input-button") && !e.relatedTarget.classList.contains("target-button"))) {
            setState({
                ...state,
                inputText: state.currentFilterValue || ""
            });
        }
    };

    const onTargetButtonClick = (selectedIndex: number) => {
        setState({
            ...state,
            currentTargetIndex: selectedIndex
        });

        applyFilter(selectedIndex);
    };

    const applyFilter = (newTargetIndex: number = null) => {
        const targetIndex = newTargetIndex === null ? state.currentTargetIndex : newTargetIndex;

        if (state.inputText) {
            props.textSearchFilterService.setFilter(state.inputText, state.targets[targetIndex]);
        }
        else {
            props.textSearchFilterService.clearFilter();
        }
    };

    const visualContainerStyle: React.CSSProperties = {
        width: state.width,
        height: state.height,
        fontFamily: state.settings?.slicerRormatting?.fontFamily,
        color: state.settings?.slicerRormatting?.inputFontColor,
        fontSize: convertFontSize(state.settings?.slicerRormatting?.fontSize),
        margin: "5px 5px 0 5px"
    };

    const inputFieldStyle: React.CSSProperties = {
        paddingTop: `${state.settings?.slicerRormatting?.padding + 1}px`,
        paddingLeft: `${state.settings?.slicerRormatting?.padding + 1}px`,
        paddingRight: `${state.settings?.slicerRormatting?.padding + 1}px`,
        paddingBottom: `${state.settings?.slicerRormatting?.padding - 1}px`
    };

    const placeholderCss = `
        ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: ${state.settings?.slicerRormatting?.placeholderFontColor};
            opacity: 1; /* Firefox */
        }

        :-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: ${state.settings?.slicerRormatting?.placeholderFontColor};
        }

        ::-ms-input-placeholder { /* Microsoft Edge */
            color: ${state.settings?.slicerRormatting?.placeholderFontColor};
        }
    `;

    return (
        state.isLoaded ? (
            <div style={visualContainerStyle}>
                {
                    (state.targets && state.targets.length > 0) ? (
                        <>
                            <style> {placeholderCss} </style>
                            <div className="input-container" style={{ background: state.settings?.slicerRormatting?.fill }}>
                                <input
                                    className="input-field"
                                    style={inputFieldStyle}
                                    placeholder={state.settings?.slicerRormatting?.placeholderString}
                                    type="text"
                                    value={state.inputText}
                                    onChange={onTextInputChange}
                                    onKeyDown={onTextInputKeyDown}
                                    onBlur={onTextInputBlur} />
                                <button className="input-button" onClick={onSearchButtonClick}>
                                    <SearchIcon></SearchIcon >
                                </button>
                                <button className="input-button" onClick={onClearButtonClick}>
                                    <CrossIcon></CrossIcon >
                                </button>
                            </div>

                            {
                                (state.targets.length > 1) ? (
                                    <div className="target-container">
                                        {state.targets.map((target, targetIndex) => (
                                            <button className={`target-button ${state.currentTargetIndex == targetIndex ? "target-button__active" : ""}`} onClick={() => onTargetButtonClick(targetIndex)}>
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
                            {state.settings?.slicerRormatting?.notSelectedString}
                        </div>
                    )
                }
            </div>
        ) : (
            null
        )
    );
}

export default TextSearchSlicer;
export {
    updateVisualComponentState,
    ITextSearchSlicerState
};