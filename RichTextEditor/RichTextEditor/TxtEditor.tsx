//import * as React from "react";

import React, {  useRef } from 'react'
import MUIRichTextEditor from 'mui-rte'

export interface ITxtEditorProps {
    
    onChangeEditor?: (data:string) => void;
    CurrentValue?:string;

}

export interface IReactUIDropDownState extends React.ComponentState, ITxtEditorProps {
    

}

export class RichTextEditors extends React.Component<ITxtEditorProps, IReactUIDropDownState> {

    

   
    constructor(props: ITxtEditorProps) {
        super(props);
        this.state = {};
    }
    

    public render(): JSX.Element {
	
        return ( 
            <MUIRichTextEditor 
            label="Type something here..."
            inlineToolbar={false}
            value={this.props.CurrentValue}
            onSave={this.props.onChangeEditor}
            toolbar={true}
        />)
      }
}
