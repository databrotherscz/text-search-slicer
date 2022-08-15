import { IFilterColumnTarget } from "powerbi-models";

interface ITextSearchSlicerTarget extends IFilterColumnTarget {
    displayName: string;
}

export default ITextSearchSlicerTarget;