/**
 * @category Options
 */
export interface ISlow {
    /**
     * @deprecated this property will be removed soon, please use the HoverMode.slow in the HoverEvent
     */
    active: boolean;

    factor: number;
    radius: number;
}
