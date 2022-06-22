import { IAdvancedFilter, IFilterColumnTarget } from "powerbi-models";
import * as React from "react";
import { useEffect, useState } from "react";
import FilterService from "../services/filterService";
import { VisualSettings } from "../settings";
import powerbi from "powerbi-visuals-api";
import "../style/TextSearchSlicer.css";

// -------------------- TYPES --------------------

interface IUpdatableSearchSlicerState {

}

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
    filterService: FilterService,
}

// -------------------- IMPLEMENTATION --------------------

const initialState: ITextSearchSlicerState = {
    isLoaded: false,
    width: 10,
    height: 10,
    settings: null,

    inputText: null,
    targets: [],
    currentTargetIndex: 0,

    currentFilterValue: null,
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
                // set index if it is present in newState otherwise check if previous index is in bound and possibly set to 0
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
        clearFilter();
    };

    const onTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        applyFilter();
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
            props.filterService.setFilter(state.inputText, state.targets[targetIndex]);
        }
        else {
            clearFilter();
        }
    };

    const clearFilter = () => {
        setState({
            ...state,
            inputText: ""
        });
        props.filterService.clearFilter();
    };

    const getVisualContainerStyle = () => {
        let style: React.CSSProperties = {
            width: state.width,
            height: state.height,
            fontFamily: state.settings?.formatting?.fontFamily,
            color: state.settings?.formatting?.fontColor,
            fontSize: state.settings?.formatting?.fontSize
        };
        return style;
    };

    return (
        state.isLoaded ? (
            <div style={getVisualContainerStyle()}>
                {
                    (state.targets && state.targets.length > 0) ? (
                        <>
                            <div className="input-container" style={{ background: state.settings?.formatting?.fill }}>
                                <input
                                    className="input-field"
                                    style={{
                                        padding: `${state.settings?.formatting?.padding}px`
                                    }}
                                    type="text"
                                    value={state.inputText}
                                    onChange={onTextInputChange}
                                    onKeyDown={onTextInputKeyDown} />
                                <button className="input-button" onClick={onSearchButtonClick}>🔍</button>
                                <button className="input-button" onClick={onClearButtonClick}>🚽</button>
                            </div>

                            {
                                (state.targets.length > 1) ? (
                                    <div className="target-container">
                                        {state.targets?.map((target, targetIndex) => (
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
                            No columns selected
                        </div>
                    )
                }
            </div>
        ) : (
            null
        )
    )
}

export default TextSearchSlicer;
export {
    updateVisualComponentState,
    ITextSearchSlicerState
};