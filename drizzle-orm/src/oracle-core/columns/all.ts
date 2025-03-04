import { varchar2 } from "./varchar2";
import { integer } from "./integer";

export function getOracleColumnBuilders() {
    return {
        varchar2,
        integer,
    }
}

export type OracleColumnsBuilders = ReturnType<typeof getOracleColumnBuilders>;


