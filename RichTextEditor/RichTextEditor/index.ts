import { IInputs, IOutputs } from "./generated/ManifestTypes";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { RichTextEditors, ITxtEditorProps } from "./TxtEditor";

export class RichTextEditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _Container: HTMLDivElement;
	
	
	private _notifyOutputChanged: () => void;
	/**
	 * Empty constructor.
	 */
	private props: ITxtEditorProps = {
		onChangeEditor: this.onChangeEditor.bind(this),
		CurrentValue:""

	};

	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		
		this._Container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		this.props.CurrentValue=String(context.parameters.sampleProperty.raw)=='val'?"":String(context.parameters.sampleProperty.raw);
		//CKEDITOR.replace( 'editor1' );
		// Add control initialization code
		ReactDOM.render(
			// Create the React component
			React.createElement(
				RichTextEditors,
				this.props
			),
			this._Container
		);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		 
		// // Add code to update control view
		// if(this.props.CurrentValue!==context.parameters.sampleProperty.raw){
		// ReactDOM.render(
		// 	// Create the React component
		// 	React.createElement(
		// 		RichTextEditors,
		// 		this.props
		// 	),
		// 	this._Container
		// );
		// 	}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		
		return {
			sampleProperty:this.props.CurrentValue
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

	private onChangeEditor(data:string) {
		
		this.props.CurrentValue=data;
		this._notifyOutputChanged();
	}
}