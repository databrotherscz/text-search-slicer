import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import { AdvancedFilter, BasicFilter, FilterType, IAdvancedFilter, IAdvancedFilterCondition, IBasicFilter, IFilterColumnTarget, ITupleFilter, ITupleFilterTarget,  } from "powerbi-models";
import FilterAction = powerbi.FilterAction;

class FilterService {
    private host: IVisualHost;

    constructor(host: IVisualHost) {
        this.host = host;
    }

    public setFilter(value: string, target: IFilterColumnTarget) {       
        if (!target) {
            console.error("Filter target is null");  
            return;          
        }

        if (!value) {
            console.error("Value is null");   
            return;  
        }

        const conditions: IAdvancedFilterCondition[] = [];
        if (value) {
            conditions.push({
                operator: "Contains",
                value: value
            });
        }
        
        const filter : IAdvancedFilter = {
            $schema: "http://powerbi.com/product/schema#advanced",
            ...(new AdvancedFilter(target, "And", conditions))
        };

        console.log("Filter applied", filter);
        
        
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

export default FilterService;