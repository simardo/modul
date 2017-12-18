import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './navbar.html?style=./navbar.scss';
import { NAVBAR_NAME, NAVBAR_ITEM_NAME } from '../component-names';
import NavbarItemPlugin, { BaseNavbar, MNavbarInterface } from '../navbar-item/navbar-item';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

export enum MNavbarSkin {
    Regular = 'regular',
    Light = 'light',
    Dark = 'dark',
    Plain = 'plain',
    Arrow = 'arrow'
}

@WithRender
@Component
export class MNavbar extends BaseNavbar implements MNavbarInterface {

    @Prop({
        default: MNavbarSkin.Regular,
        validator: value =>
            value == MNavbarSkin.Regular ||
            value == MNavbarSkin.Light ||
            value == MNavbarSkin.Dark ||
            value == MNavbarSkin.Plain ||
            value == MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop()
    public line: boolean;
    @Prop()
    public value: string;
    @Prop({ default: true })
    public margin: boolean;
    @Prop()
    public disabled: boolean;

    private isAnimActive: boolean = false;
    private internalValue: string = '';

    public selecteItem(el): void {
        if (this.skin == MNavbarSkin.Light && el != undefined) {
            this.setLinePosition(el);
        }
        if (this.skin == MNavbarSkin.Arrow && el != undefined) {
            this.setArrowPosition(el);
        }
    }

    protected mounted() {
        this.model = this.value;
        this.setItem();
        this.$nextTick(() => {
            this.initLine();
        });
    }

    public get model(): string {
        return this.internalValue;
    }

    public set model(value: string) {
        console.log('value', value);
        this.internalValue = this.disabled ? '' : value;
    }

    private setItem(): void {
        this.$children.forEach((child, index, arr) => {
            if (index == 0 && arr.length >= 1) {
                child['isFirst'] = true;
            }
            if (arr.length - 1 === index && arr.length > 1) {
                child['isLast'] = true;
            }
        });
    }

    private initLine(): void {
        this.$children.forEach((child, index, arr) => {
            if (child.$props.value == this.value) {
                if (this.skin == MNavbarSkin.Light) {
                    this.setLinePosition(child.$el);
                }
                if (this.skin == MNavbarSkin.Arrow) {
                    this.setArrowPosition(child.$el);
                }
            }
        });
    }

    private setLinePosition(el: HTMLElement): void {
        if (!this.disabled) {
            this.$nextTick(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        let positionX: number = el.offsetLeft;
                        let width: number = el.clientWidth;
                        let lineEL: HTMLElement = this.$refs.line as HTMLElement;
                        lineEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                        lineEL.style.width = width + 'px';
                        setTimeout(() => {
                            this.isAnimActive = true;
                        });
                    }, 0);
                }, 0);
            });
        }
    }

    private setArrowPosition(el: HTMLElement): void {
        if (!this.disabled) {
            this.$nextTick(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        let positionX: number = el.offsetLeft;
                        let width: number = el.clientWidth;
                        let arrowEL: HTMLElement = this.$refs.Arrow as HTMLElement;
                        arrowEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                        arrowEL.style.width = width + 'px';
                        setTimeout(() => {
                            this.isAnimActive = true;
                        });
                    }, 0);
                }, 0);
            });
        }
    }

    private get hasLine(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Light;
        }
        return this.line;
    }

    private get hasArrow(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Arrow;
        }
        return this.line;
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;