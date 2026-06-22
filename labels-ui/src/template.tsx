import Button from '@mui/material/Button';
import { type LabelColorData } from './labeldata';
import './template.css'
import Stack from '@mui/material/Stack';
 
interface LabelBtnProps {
    id: string;
    name: string;
    onClick?: (id: string) => void;
    color?: LabelColorData;
    disabled?: boolean
}

export default function LabelBtn({ id, name, onClick=(id)=>id, color, disabled = false }: LabelBtnProps )  {

    return <Button 
                variant="outlined"
                size="medium"
                onClick={() => onClick(id)}
                disabled={disabled}
                className={'label-btn'}
                style={{ 
                    color: color?.textColor || 'black', 
                    backgroundColor: color?.backgroundColor || 'white', 
                    borderColor: color?.backgroundColor || 'black' }}>
                { name }
            </Button>

}

export const LabelFormItem = ({ children }) => <Stack direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 1, sm: 2, md: 4 }} >{children}</Stack>

export const FormItemTitle = ({ children }) => <label style={{ width: '30%', minWidth: 300, padding: 5, color: 'inherit', textAlign: 'left' }} >{children}</label>
