import type { ColumnBuilderBase,  ColumnBuilderRuntimeConfig,  ColumnDataType} from "~/column-builder.ts";
import type { ColumnBaseConfig } from "~/column.ts";
import { entityKind } from "~/entity.ts";
import { SQL } from "~/sql";
import { Column } from "~/column.ts";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, HasGenerated, MakeColumnConfig } from "~/column-builder.ts";
import { AnyOracleTable, OracleTable } from "~/oracle-core/table.ts";

export abstract class OracleColumn<
  T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>,
  TRuntimeConfig extends object = object,
  TTypeConfig extends object = object,
> extends Column<T, TRuntimeConfig, TTypeConfig & { dialect: "oracle" }> {
  static override readonly [entityKind]: string = "OracleColumn";

  constructor(
    override readonly table: OracleTable,
    config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>,
  ) {
    super(table, config);
  }
}

export interface OracleColumnBuilderBase<
    T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>,
    TTypeConfig extends object = object,
> extends ColumnBuilderBase<T, TTypeConfig & { dialect: 'oracle' }> {}



export abstract class OracleColumnBuilder<
    T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>,
    TRuntimeConfig extends object = object,
    TTypeConfig extends object = object,
    TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig,
> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & { dialect: 'oracle' }, TExtraConfig>
implements OracleColumnBuilderBase<T, TTypeConfig> {
    static override readonly [entityKind]: string = "OracleColumnBuilder";

    override generatedAlwaysAs(as: SQL | T['data'] | (() => SQL)): HasGenerated<this, { type: "always"; }> {
        throw new Error("Method not implemented.");
    }

    /** @internal */
    abstract build<TTableName extends string>(
        table: AnyOracleTable<{ name: TTableName }>,
    ): OracleColumn<MakeColumnConfig<T, TTableName>>;
}