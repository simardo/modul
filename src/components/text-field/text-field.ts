import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './text-field.html?style=./text-field.scss';
import { TEXT_FIELD_NAME } from '../component-names';

export type MTexteFieldType = 'text' | 'password' | 'email' | 'url' | 'tel';
export type MTexteFieldState = 'default' | 'disabled' | 'error' | 'valid';

@WithRender
@Component
export class MTexteField extends Vue {

    @Prop({ default: 'text' })
    public type: MTexteFieldType;
    @Prop({ default: 'default' })
    public state: MTexteFieldState;
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: '' })
    public defaultText: string;
    @Prop({ default: true })
    public isEditable: boolean;
    @Prop({ default: '' })
    public iconName: string;
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;
    @Prop({ default: false })
    public isForceFocus: boolean;

    public componentName: string = TEXT_FIELD_NAME;

    private propsType: MTexteFieldType;
    private propsState: MTexteFieldState;
    private propsValue: string = '';
    private propsDefaultText: string;
    private propsIsEditable: boolean;
    private hasIcon: boolean;
    private hasHelperText: boolean;
    private isValueEmpty: boolean = false;
    private isDefaultTextEmpty: boolean = false;
    private isFocusActive: boolean = false;
    // private propsIsFoceFocus: boolean = false;
    private isUpdating: number;

    @Watch('value')
    private valueChanged(value: string): void {
        this.propsValue = this.value;
    }

    @Watch('propsValue')
    private propsValueChanged(value: string): void {
        // Delayed $emit to limit event fired
        if (this.isUpdating) {
            clearTimeout(this.isUpdating);
        }

        this.isUpdating = window.setTimeout(
            () => this.$emit('valueChanged', this.propsValue)
        , 300);
    }

    private beforeMount(): void {
        this.propsType = this.type;
        this.propsState = this.state;
        this.propsValue = this.value;
        this.propsIsEditable = this.isEditable;
        this.propsDefaultText = this.defaultText;
        this.hasIcon = this.iconName != '';
        this.hasHelperText = this.helperMessage != '';
        this.checkHasValue();
        this.checkHasDefaultText();
    }

    private mounted() {
        if (this.propsIsEditable) {
            // Set attribute type on input refs
            this.$refs.input['type'] = this.propsType;
        }
    }

    private onFocus(event): void {
        this.isFocusActive = this.isDisabled ? false : true;
        if (!this.isDisabled) {
            this.$refs.input['focus']();
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('focus', event, this.propsValue);
        }
    }

    private onBlur(event): void {
        this.isFocusActive = this.isDisabled ? true : false;
        if (!this.isDisabled) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('blur', event, this.propsValue);
        }
    }

    private onKeyup(event): void {
        if (!this.isDisabled) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('keyup', event, this.propsValue);
        }
    }

    private onClick(event): void {
        if (!this.isDisabled) {
            this.$emit('click', event, this.propsValue);
        }
        event.preventDefault();
    }

    private checkHasValue(): void {
        this.isValueEmpty = String(this.propsValue).length == 0 ? true : false;
    }

    private get isDisabled(): boolean {
        return this.propsState == 'disabled';
    }

    private get hasError(): boolean {
        if (this.errorMessage != '' || this.state == 'error') {
            this.propsState = 'error';
            return true;
        } else if (this.propsState != 'disabled') {
            this.propsState = 'default';
        }
        return false;
    }

    private checkHasDefaultText() {
        if (this.propsDefaultText == '' || this.propsDefaultText == undefined) {
            this.isDefaultTextEmpty = true;
        } else if (this.isValueEmpty && this.isFocusActive) {
            this.isDefaultTextEmpty = false;
        } else {
            this.isDefaultTextEmpty = true;
        }
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTexteField);
    }
};

export default TextFieldPlugin;
