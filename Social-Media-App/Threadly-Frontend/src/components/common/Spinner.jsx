// Spinner component for displaying a loading indicator, with optional centering and customizable size
// The spinner is styled using a CSS class that creates a rotating border animation, and the size can be adjusted through props. When the 'center' prop is true, the spinner is wrapped in a flex container to center it both vertically and horizontally, with additional padding for spacing.
import { misc } from '../../styles/common'
export default function Spinner({ size=32, center=false }) {
  const el = <div className={misc.spinner} style={{width:size,height:size,borderWidth:Math.max(2,size/14)}}/>
  if (center) return <div className="flex justify-center items-center py-12">{el}</div>
  return el
}
