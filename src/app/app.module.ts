import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import {NgZorroAntdModule, NZ_I18N, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS, zh_CN} from 'ng-zorro-antd';
import {IconDefinition} from '@ant-design/icons-angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// 引入全部图标
// import * as AllIcons from '@ant-design/icons-angular/icons';
// const antDesignIcons = AllIcons as {
//     [key: string]: IconDefinition;
// };
// const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

// 引入需要的图标
import { PlusOutline, MinusOutline, DownloadOutline, CopyOutline, SmileOutline } from '@ant-design/icons-angular/icons';
const icons: IconDefinition[] = [ PlusOutline, MinusOutline, DownloadOutline, CopyOutline, SmileOutline ];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        NgZorroAntdModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: NZ_I18N, useValue: zh_CN },
        { provide: NZ_ICONS, useValue: icons },
        { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
