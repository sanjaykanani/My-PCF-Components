import { IInputs, IOutputs } from "./generated/ManifestTypes";



export class CsvDropdownControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _value: string;
	private _dropdown: HTMLSelectElement;
	private _firstOption: HTMLOptionElement;
	private _isRequiedField: boolean;
	private _isLockedField: boolean;

	private _refreshData: EventListenerOrEventListenerObject;
	private _changeFirstOptionText: EventListenerOrEventListenerObject;
	private _resetFirstOptionText: EventListenerOrEventListenerObject;


	constructor() {

	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		
		this._container = container;
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		
		this._refreshData = this.refreshData.bind(this);
		this._changeFirstOptionText = this.changeFirstOptionText.bind(this);
		this._resetFirstOptionText = this.resetFirstOptionText.bind(this);
		
		this._isRequiedField = (<any>context.parameters.fieldValue).attributes.RequiredLevel == 2;
		this._isLockedField = context.mode.isControlDisabled;

		let csvValues = context.parameters.csvValues.raw;
		let dropdown = document.createElement("select");
		dropdown.addEventListener("change", this._refreshData);
		dropdown.addEventListener("mouseover", this._changeFirstOptionText);
		dropdown.addEventListener("focus", this._changeFirstOptionText);
		dropdown.addEventListener("mouseout", this._resetFirstOptionText);
		dropdown.addEventListener("blur", this._resetFirstOptionText);

		this._dropdown = dropdown;

		//if (!this._isRequiedField) {
			let option = document.createElement("option");
			option.value = "";
			option.text = "- Select -";
			dropdown.appendChild(option);

			this._firstOption = option;
		//}

		//let valuesList:Array<{ Id: string, name: string > = csvValues.split(";");
		
		
		// Xrm.WebApi.retrieveMultipleRecords('template', fetchXml
		// ).then(function success(result:any){
		// 	debugger;
	
		// },
		// function(error:any){
		// 	console.log(error.message);
		// });Xrm
		
		let webApiUrl:string=context.parameters.csvValues.raw;//"/api/data/v9.1/templates?$filter=(languagecode%20eq%201033%20)and(templatetypecode%20eq%20%27contact%27)&$select=title,templateid";
		let valuefield=context.parameters.valueField.raw;
		let textField=context.parameters.textField.raw;

		const serverUrl = Xrm.Page.context.getClientUrl();
		let req = new XMLHttpRequest();
		req.open("GET", serverUrl + webApiUrl, true);
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		req.setRequestHeader("OData-MaxVersion", "4.0");
		req.setRequestHeader("OData-Version", "4.0");
		req.onreadystatechange = () => {
			if (req.readyState == 4 /* complete */) {
				req.onreadystatechange = null; /* avoid potential memory leak issues.*/

				if (req.status == 200) {
					var data = JSON.parse(req.response);
					
                  if(data.value){
					let valuesList = data.value
					 
					valuesList.forEach((element:{[k: string]: any}) => {
						let option = document.createElement("option");
						option.value = element[valuefield];
						option.text = element[textField];
						dropdown.appendChild(option);
					});
					
					
			
					container.appendChild(dropdown);
			
					this._value = context.parameters.fieldValue.raw;
			
					if (this._value != null) { 
						dropdown.value = this._value; 
					}
									
				}
				} else {
					var error = JSON.parse(req.response).error;
					console.log(error.message);
				}
			}
		};
		req.send();
		
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._isLockedField = context.mode.isControlDisabled;
		this._dropdown.disabled = this._isLockedField;
	}

	public getOutputs(): IOutputs {
		return {
			fieldValue: this._value
		};
	}

	public destroy(): void {
		this._dropdown.removeEventListener("change", this.refreshData);
	}

	public refreshData(): void {
		this._value = this._dropdown.value;
		this._notifyOutputChanged();
	}

	public changeFirstOptionText(): void {
		this._firstOption.text = "--Select--";
	}

	public resetFirstOptionText(): void {
		if (document.activeElement == this._dropdown) return;
		this._firstOption.text = "---";
	}

	


}