import { useEffect, useState } from "react";
import ReactSelect, {
  type Props as ReactSelectProps,
  type StylesConfig,
} from "react-select";
import { clsx } from "clsx";
import styles from "./select.module.scss";

interface SelectOption {
  label: string;
  value: string;
}

interface IProps extends ReactSelectProps<SelectOption, false> {
  className?: string;
}

const stylesConfig: StylesConfig<SelectOption, false> = {
  input: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
  }),
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "var(--select)",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      border: "none",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--text-black)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--select-menu)",
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden", // чтобы скругление не обрезалось
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    padding: "12px 16px",
    cursor: "pointer",
    fontSize: "12px",
    color: state.isSelected ? "#fff" : "var(--text-black)",
    backgroundColor: state.isSelected
      ? "var(--blue)"
      : state.isFocused
        ? "var(--muted-foreground)"
        : "transparent",
    transition: "background-color 0.2s ease",
  }),
};

export default function Select(props: IProps) {
  const {
    options,
    className = "",
    isSearchable = false,
    value,
    defaultValue,
    onChange,
    ...otherProps
  } = props;

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<SelectOption | null | undefined>(
    (defaultValue as SelectOption | null | undefined) ?? null,
  );

  // Если меняется defaultValue (например, после загрузки options) и Select не контролируемый —
  // синхронизируем внутреннее значение.
  useEffect(() => {
    if (!isControlled) {
      setInternalValue((defaultValue as SelectOption | null | undefined) ?? null);
    }
  }, [defaultValue, isControlled]);

  const handleChange: IProps["onChange"] = (newValue, actionMeta) => {
    if (!isControlled) {
      setInternalValue((newValue as SelectOption | null | undefined) ?? null);
    }

    if (onChange) {
      onChange(newValue, actionMeta);
    }
  };

  return (
    <ReactSelect
      className={clsx(styles["Select"], className)}
      options={options}
      styles={stylesConfig}
      // Превращаем компонент в контролируемый внутри,
      // чтобы defaultValue корректно отрабатывал при изменении options.
      value={isControlled ? value : internalValue}
      defaultValue={undefined}
      onChange={handleChange}
      components={{
        IndicatorSeparator: () => null,
      }}
      isSearchable={isSearchable}
      {...otherProps}
    />
  );
}
