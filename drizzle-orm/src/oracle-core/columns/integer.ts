import { OracleColumn, OracleColumnBuilder } from "./common.ts";
import { entityKind } from "~/entity.ts";
import type { ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, MakeColumnConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { AnyOracleTable } from "~/oracle-core/table.ts"; 

export type OracleIntegerBuilderInitial<TName extends string> = OracleIntegerBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'OracleInteger';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;

export class OracleIntegerBuilder<
    T extends ColumnBuilderBaseConfig<'number', 'OracleInteger'>
> extends OracleColumnBuilder<T> {
    static override readonly [entityKind]: string = 'OracleIntegerBuilder';

    constructor(name: T['name']) {
        super(name, 'number', 'OracleInteger');
    }

    /** @internal */
    override build<TTableName extends string>(
        table: AnyOracleTable<{ name: TTableName }>,
    ): OracleInteger<MakeColumnConfig<T, TTableName>> {
        return new OracleInteger<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
    }

}

export class OracleInteger<T extends ColumnBaseConfig<'number', 'OracleInteger'>> extends OracleColumn<T> {
    static override readonly [entityKind]: string = 'PgInteger';
    
    getSQLType(): string {
		return 'integer';
	}

    override mapFromDriverValue(value: number | string): number {
        if (typeof value === 'string') {
            return Number.parseInt(value);
        }
        return value;
    }
}
export function integer(): OracleIntegerBuilderInitial<''>;
export function integer<TName extends string>(name: TName): OracleIntegerBuilderInitial<TName>;
export function integer(name?: string) {
    return new OracleIntegerBuilder(name ?? '');
}

let thing: OracleIntegerBuilderInitial<''> = integer().primaryKey();