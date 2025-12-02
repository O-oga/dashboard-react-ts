
import type { HistoryItemAPI } from "@/types/loaderData.types"
import { type GetHistoryParams, getHistory } from "./loader"

interface CreateGraphDataParams extends GetHistoryParams {
    quantityOfColumns?: number
}

export interface GraphDataPoint {
    time: Date
    value: number
}

export const createGraphData = async (params: CreateGraphDataParams) => {

    const{
        entity_ids,
        start_time,
        end_time,
        past_hours,
        past_days,
    } = params    
    const graphDataPoints: GraphDataPoint[] = [];

    return getHistory({
        entity_ids: entity_ids,
        start_time: start_time || undefined,
        end_time: end_time || new Date(),
        past_hours: past_hours || 0,
        past_days: past_days || 0
    })
    .catch(error => {
        console.error('Error getting history:', error)
        return {} as Record<string, HistoryItemAPI[]>
    })
    .then(data => {
        const entityId: string = params.entity_ids[0]
        
        if (!data || data[entityId].length === 0) {
            return []
        }
        const entityDataArray = data[entityId]
        const firstEntityData = entityDataArray[0].lu
        const lastEntityData = entityDataArray[entityDataArray.length - 1].lu
        const dataPeriod = lastEntityData!- firstEntityData!
        const dataPeriodInDays = dataPeriod / 86400;
        const graphData: GraphDataPoint[] = entityDataArray.map((item: HistoryItemAPI) => {
            return {
                time: new Date(item.lu! * 1000),
                value: parseFloat(item.s!)
            }
        })
        // graphDataPoints.forEach((point, index) => {
        //     graphData.map((item) => {
        //         const currentTimePoint = item.time
        //     })
        // })
        
        return  graphDataPoints
    })
}