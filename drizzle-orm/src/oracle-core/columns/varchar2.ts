import type { ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, MakeColumnConfig } from '~/column-builder.ts';
import { entityKind } from '~/entity.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { getColumnNameAndConfig, type Writable } from '~/utils.ts';
import type { AnyOracleTable } from '~/oracle-core/table.ts';
import { OracleColumn, OracleColumnBuilder } from './common.ts';

export type OracleVarchar2BuilderInitial<
    TName extends string,
    TEnum extends [string, ...string[]],
    TLength extends number | undefined,
> = OracleVarchar2Builder<{
    name: TName;
    dataType: 'string';
    columnType: 'OracleVarchar2';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
    length: TLength;
}>;

export class OracleVarchar2Builder<
    T extends ColumnBuilderBaseConfig<'string', 'OracleVarchar2'> & { length?: number | undefined },
> extends OracleColumnBuilder<
    T,
    { length: T['length']; enumValues: T['enumValues'] },
    { length: T['length'] }
> {
    static override readonly [entityKind]: string = 'OracleVarchar2Builder';

    constructor(name: T['name'], config: OracleVarchar2Config<T['enumValues'], T['length']>) {
        super(name, 'string', 'OracleVarchar2');
        this.config.length = config.length;
        this.config.enumValues = config.enum;
    }

    /** @internal */
    override build<TTableName extends string>(
        table: AnyOracleTable<{ name: TTableName }>,
    ): OracleVarchar2<MakeColumnConfig<T, TTableName> & { length: T['length'] }> {
        return new OracleVarchar2<MakeColumnConfig<T, TTableName> & { length: T['length'] }>(
            table,
            this.config as ColumnBuilderRuntimeConfig<any, any>,
        );
    }
}

export class OracleVarchar2<T extends ColumnBaseConfig<'string', 'OracleVarchar2'> & { length?: number | undefined }>
    extends OracleColumn<T, { length: T['length']; enumValues: T['enumValues'] }, { length: T['length'] }>
{
    static override readonly [entityKind]: string = 'OracleVarchar2';

    readonly length = this.config.length;
    override readonly enumValues = this.config.enumValues;

    getSQLType(): string {
        return this.length === undefined ? `varchar` : `varchar(${this.length})`;
    }
}

export interface OracleVarchar2Config<
    TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined,
    TLength extends number | undefined = number | undefined,
> {
    enum?: TEnum;
    length?: TLength;
}

export function varchar2(): OracleVarchar2BuilderInitial<'', [string, ...string[]], undefined>;
export function varchar2<
    U extends string,
    T extends Readonly<[U, ...U[]]>,
    L extends number | undefined,
>(
    config?: OracleVarchar2Config<T | Writable<T>, L>,
): OracleVarchar2BuilderInitial<'', Writable<T>, L>;
export function varchar2<
    TName extends string,
    U extends string,
    T extends Readonly<[U, ...U[]]>,
    L extends number | undefined,
>(
    name: TName,
    config?: OracleVarchar2Config<T | Writable<T>, L>,
): OracleVarchar2BuilderInitial<TName, Writable<T>, L>;
export function varchar2(a?: string | OracleVarchar2Config, b: OracleVarchar2Config = {}): any {
    const { name, config } = getColumnNameAndConfig<OracleVarchar2Config>(a, b);
    return new OracleVarchar2Builder(name, config as any);
}
