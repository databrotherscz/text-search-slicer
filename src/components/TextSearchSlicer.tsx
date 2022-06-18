import { IAdvancedFilter, IFilterColumnTarget } from "powerbi-models";
import * as React from "react";
import { useEffect, useState } from "react";
import FilterService from "../services/filterService";
import { VisualSettings } from "../settings";
import powerbi from "powerbi-visuals-api";

// -------------------- TYPES --------------------

interface IUpdatableSearchSlicerState {

}

interface ITextSearchSlicerState {
    inputText?: string,
    currentFilterValue?: string,
    isLoaded?: boolean,
    width?: number,
    height?: number,
    settings?: VisualSettings,
    targets?: IFilterColumnTarget[],
    currentTarget?: IFilterColumnTarget
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
    
    currentFilterValue: null,
    inputText: null,
    
    targets: null,
    currentTarget: null
};

let updateVisualComponentState: UpdateVisualComponent = null;

function TextSearchSlicer(props: ITextSearchSlicerProps) {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        updateVisualComponentState = (newState) => {
            setState(prevState => ({
                ...prevState,
                ...newState
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

    const onTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        applyFilter();
    };

    const onTextInputBlur = () => {
        console.log("Blur");
    };

    const applyFilter = () => {
        if (state.inputText) {
            props.filterService.setFilter(state.inputText, state.targets[0]);
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

    return (
        <div style={{ width: state.width, height: state.height, display: state.isLoaded ? "block" : "none" }}>
            <div style={{ display: "flex", width: "100%" }}>
                <input style={{ width: "100%", fontFamily: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif' }} type="text" value={state.inputText} onChange={onTextInputChange} onKeyDown={onTextInputKeyDown} onBlur={onTextInputBlur} />
                <button onClick={applyFilter}>✔</button>
                <button onClick={clearFilter}>⨉</button>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
                {state.targets?.map(t => (
                    <button>
                        {t.column}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TextSearchSlicer;
export {
    updateVisualComponentState,
    ITextSearchSlicerState
};