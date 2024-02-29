/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AutocompleteModule,
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  IconModule,
  RadioButtonModule,
  SearchModule,
  SpinnerModule,
  StatusLabelModule,
  TableModule,
} from '@abraxas/base-components';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeDeCh from '@angular/common/locales/de-CH';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ActionMenuItemComponent } from './components/action-menu-item/action-menu-item.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ButtonBarComponent } from './components/button-bar/button-bar.component';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { EnvironmentChipComponent } from './components/environment-chip/environment-chip.component';
import { IconTextComponent } from './components/icon-text/icon-text.component';
import { InlineSpinnerComponent } from './components/inline-spinner/inline-spinner.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageComponent } from './components/page/page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SplitScreenComponent } from './components/split-screen/split-screen.component';
import { TenantSelectionComponent } from './components/tenant-selection/tenant-selection.component';
// tslint:disable-next-line:max-line-length
import { SearchableTreeNavigationComponent } from './components/tree-navigation/searchable-tree-navigation/searchable-tree-navigation.component';
import { TreeNavigationComponent } from './components/tree-navigation/tree-navigation.component';
import { MousemoveOutsideDirective } from './directives/mousemove-outside.directive';
import { MouseupOutsideDirective } from './directives/mouseup-outside.directive';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { GRPC_INTERCEPTORS } from './services/grpc/grpc-interceptor';
import { GrpcAppInterceptor } from './services/grpc/interceptors/grpc-app.interceptor';
import { GrpcAuthInterceptor } from './services/grpc/interceptors/grpc-auth.interceptor';
import { GrpcTenantInterceptor } from './services/grpc/interceptors/grpc-tenant.interceptor';
import { HttpAppInterceptor } from './services/http/interceptors/http-app.interceptor';
import { HttpAuthInterceptor } from './services/http/interceptors/http-auth.interceptor';
import { HttpTenantInterceptor } from './services/http/interceptors/http-tenant.interceptor';
import { SecurityUtil } from './services/security.util';
import { REST_API_URL, SEARCH_DEBOUNCE_TIME } from './tokens';
import { HttpTokenRefreshInterceptor } from './services/http/interceptors/http-token-refresh.interceptor';
import { GrpcTokenRefreshInterceptor } from './services/grpc/interceptors/grpc-token-refresh.interceptor';

registerLocaleData(localeDeCh);

const components = [
  ActionMenuComponent,
  ActionMenuItemComponent,
  BackButtonComponent,
  ButtonBarComponent,
  ConfirmDialogComponent,
  DialogComponent,
  EnvironmentChipComponent,
  InlineSpinnerComponent,
  PageComponent,
  PageHeaderComponent,
  SidebarComponent,
  TenantSelectionComponent,
  SearchableTreeNavigationComponent,
  TreeNavigationComponent,
  IconTextComponent,
  SplitScreenComponent,
];

const directives = [MousemoveOutsideDirective, MouseupOutsideDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [
    TranslateModule,
    CommonModule,
    IconModule,
    ButtonModule,
    SpinnerModule,
    DropdownModule,
    RadioButtonModule,
    StatusLabelModule,
    SearchModule,
    AutocompleteModule,
    TableModule,
    CheckboxModule,
    MatMenuModule,
  ],
  exports: [...components, ...directives],
})
export class VotingLibModule {
  public static forRoot(restApiUrl?: string): ModuleWithProviders<VotingLibModule> {
    return {
      ngModule: VotingLibModule,
      providers: [
        {
          provide: GRPC_INTERCEPTORS,
          multi: true,
          useClass: GrpcTokenRefreshInterceptor,
        },
        {
          provide: GRPC_INTERCEPTORS,
          multi: true,
          useClass: GrpcAppInterceptor,
        },
        {
          provide: GRPC_INTERCEPTORS,
          multi: true,
          useClass: GrpcAuthInterceptor,
        },
        {
          provide: GRPC_INTERCEPTORS,
          multi: true,
          useClass: GrpcTenantInterceptor,
        },
        {
          provide: REST_API_URL,
          useValue: restApiUrl,
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpTokenRefreshInterceptor,
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpAppInterceptor,
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpAuthInterceptor,
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpTenantInterceptor,
        },
        {
          provide: SEARCH_DEBOUNCE_TIME,
          useValue: 300,
        },
        {
          provide: LOCALE_ID,
          useValue: 'de-CH',
        },
        {
          provide: ErrorHandler,
          useClass: GlobalErrorHandler,
        },
        {
          provide: APP_INITIALIZER,
          useValue: SecurityUtil.patchWindowOpen,
          multi: true,
        },
      ],
    };
  }
}
