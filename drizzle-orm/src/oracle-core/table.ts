import type { TableConfig as TableConfigBase } from "~/table.ts";
import { entityKind } from "~/entity.ts";
import { Table, UpdateTableConfig } from "~/table.ts";
import { BuildColumns } from "~/column-builder.ts";
import { OracleColumn, OracleColumnBuilder, OracleColumnBuilderBase } from "./columns/common.ts";
import { getOracleColumnBuilders, OracleColumnsBuilders } from "./columns/all.ts";

export type TableConfig = TableConfigBase<OracleColumn>;

export type AnyOracleTable<TPartial extends Partial<TableConfig> = {}> = OracleTable<UpdateTableConfig<TableConfig, TPartial>>;

export type OracleTableWithColumns<T extends TableConfig> =
    & OracleTable<T>
    & {
        [Key in keyof T['columns']]: T['columns'][Key];
    };


export class OracleTable<T extends TableConfig = TableConfig> extends Table<T> {
    static override readonly [entityKind]: string = 'OracleTable';

    /** @internal */
    static override readonly Symbol = Object.assign({}, Table.Symbol)
}

/** @internal */
export function oracleTableWithSchema<
    TTableName extends string,
    TSchemaName extends string | undefined,
    TColumnsMap extends Record<string, OracleColumnBuilderBase>,
>(name: TTableName, columns: TColumnsMap | ((columnTypes: OracleColumnsBuilders) => TColumnsMap), schema: TSchemaName, baseName = name): OracleTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'oracle'>;
    dialect: 'oracle'
}> {

    const rawTable = new OracleTable<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'oracle'>;
        dialect: 'oracle'
    }>(name, schema, baseName);

    const parsedColumns: TColumnsMap = typeof columns === 'function' ? columns(getOracleColumnBuilders()) : columns;

    const builtColumns = Object.fromEntries(
        Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
            const colBuilder = colBuilderBase as OracleColumnBuilder;
            colBuilder.setName(name);
            const column = colBuilder.build(rawTable);
            return [name, column];
        }),
    ) as unknown as BuildColumns<TTableName, TColumnsMap, 'oracle'>;

    const table = Object.assign(rawTable, builtColumns);
    table[Table.Symbol.Columns] = builtColumns;

    return table;
}

export interface OracleTableFn<TSchema extends string | undefined = undefined> {
    <
        TTableName extends string,
        TColumnsMap extends Record<string, OracleColumnBuilderBase>,
    >(
        name: TTableName,
        columns: TColumnsMap,
    ): OracleTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'oracle'>;
        dialect: 'oracle';
    }>;

    <
        TTableName extends string,
        TColumnsMap extends Record<string, OracleColumnBuilderBase>,
    >(
        name: TTableName,
        columns: (columnTypes: OracleColumnsBuilders) => TColumnsMap,
    ): OracleTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'oracle'>;
        dialect: 'oracle';
    }>;
}

export const oracleTable: OracleTableFn = (name, columns) => {
    return oracleTableWithSchema(name, columns, undefined, undefined);
}