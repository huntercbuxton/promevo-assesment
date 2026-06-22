import Button from '@mui/material/Button';
import { type LabelColorData } from './labeldata';
import './template.css'

 
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

