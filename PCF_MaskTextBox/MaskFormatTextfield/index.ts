import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as $ from "jquery";
import "kendo-ui-core";
import { ftruncate } from "fs";
export class MaskFormatTextfield implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _context: ComponentFramework.Context<IInputs>;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;

	private _container: HTMLDivElement;
	private _MaskFormat: string | null;
	private _textValue: string | undefined;
	private _id: string;

	/**
	 * Empty constructor.
	 */
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

		// Add control initialization code
		this._id = "masktxt_" + this.ID();
		container.innerHTML = "<input id='" + this._id + "'/>";
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._MaskFormat = context.parameters.MaskFormat.raw;
		this._textValue = context.parameters.value.formatted;

		var notiUpdate = notifyOutputChanged;
		//$("#"+this._id).data("method",this._notifyOutputChanged);
		this.OnChanage = this.OnChanage.bind(this);
		$("#" + this._id).kendoMaskedTextBox({
			mask: this._MaskFormat || "",
			value: this._textValue,
			change: this.OnChanage
		});

	}

	private OnChanage() {
		
		var that=this;
		this._textValue = $("#" + this._id).val()?.toString();
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		
		// Add code to update control view
		if (this._textValue != context.parameters.value.raw) {
			this._context = context;
			this._textValue = this._context.parameters.value.raw || "";
		}

	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		debugger;
		return {
			value: this._textValue
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		this._container.innerHTML = "";
	}

	ID = function () {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	};
}