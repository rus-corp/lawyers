import style from './searchInput.module.css'
import { InputPropsType } from './input_type'



export const CreateItemInput = ({
  fieldType,
  fieldName,
  value,
  changeFunc
}: InputPropsType) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target
    changeFunc(value)
  }
  return (
    <div className={style.createField}>
      <input 
      className={style.inputField}
      type={fieldType}
      name={fieldName}
      onChange={handleChange}
      value={value}
      placeholder='Поиск по документам'
      />
    </div>
  );
}