
import * as React from 'react'
    export interface SlotProps {
        content:React.ReactNode//The React children of the parent component
        children?:React.ReactNode// The default content to render if no content is inserted from the parent component
        name?:string// The name of this slot (inserted as class name 'slot-${name}')
        id?:string// The HTML id
        className?:string// Additional class names
        dataset?:any //[default: {}] An object with keys to set as 'data-' attributes (keys must not contain a 'data-' prefix)
        role?:string// The HTML role
        as?:string// [default: 'div'] The type of Re
    }
    export class Slot extends React.Component<SlotProps>{}
