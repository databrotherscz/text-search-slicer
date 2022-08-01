import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import { AdvancedFilter, IAdvancedFilter, IAdvancedFilterCondition, IFilterColumnTarget } from "powerbi-models";
import FilterAction = powerbi.FilterAction;

class TextSearchFilterService {
    private host: IVisualHost;

    constructor(host: IVisualHost) {
        this.host = host;
    }

    public setFilter(value: string, target: IFilterColumnTarget) {       
        if (!target || !value) {
            return;          
        }

        const conditions: IAdvancedFilterCondition[] = [];
        conditions.push({
            operator: "Contains",
            value: value
        });
        
        const filter : IAdvancedFilter = {
            $schema: "http://powerbi.com/product/schema#advanced",
            ...(new AdvancedFilter(target, "And", conditions))
        };

        this.host.applyJsonFilter(
            filter,
            "general",
            "filter",
            FilterAction.merge
        );
    }

    public clearFilter() {
        this.host.applyJsonFilter(
            null, 
            "general", 
            "filter", 
            FilterAction.merge
        );
    }
}

export default TextSearchFilterService;