/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AutocompleteComponent, Tenant, TenantService } from '@abraxas/base-components';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { from, Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vo-lib-tenant-selection',
  templateUrl: './tenant-selection.component.html',
})
export class TenantSelectionComponent implements OnDestroy {
  @Input()
  public label: string = '';

  @Input()
  public disabled: boolean = false;

  @Output()
  public selectedTenantChange: EventEmitter<Tenant> = new EventEmitter<Tenant>();

  @ViewChild(AutocompleteComponent)
  public autocompleteComponent!: AutocompleteComponent;

  public selectedTenantValue: Tenant | undefined;
  public loadingTenants: boolean = false;
  public tenantsTypeahead: Subject<string> = new Subject<string>();
  public tenants: Tenant[] = [];

  private loadingTenantsSubscription: Subscription | undefined;
  constructor(
    private readonly tenantService: TenantService,
    private readonly ref: ChangeDetectorRef,
  ) {}

  @Input()
  public set selectedTenant(v: Tenant) {
    this.selectedTenantValue = v;
    this.setTenantsAndEnsureSelected();
  }

  public setSelectedTenant(v: string): void {
    this.selectedTenantValue = this.tenants.find(t => t.name === v);
    this.ref.detectChanges();
    this.selectedTenantChange.emit(this.selectedTenantValue);
  }

  public ngOnDestroy(): void {
    this.loadingTenantsSubscription?.unsubscribe();
  }

  public async searchTenants(searchValue: string): Promise<void> {
    if (searchValue.length < 3) {
      this.setTenantsAndEnsureSelected();
      return;
    }

    this.loadingTenantsSubscription?.unsubscribe();
    this.loadingTenants = true;
    this.loadingTenantsSubscription = from(
      this.tenantService.getAllTenants({
        name_contains: searchValue,
      }),
    )
      .pipe(finalize(() => (this.loadingTenants = false)))
      .subscribe(tenants => {
        this.setTenantsAndEnsureSelected(tenants);

        // workaround to open autocomplete options after tenant search
        this.autocompleteComponent.filteredItems = this.tenants;
      });
  }

  private setTenantsAndEnsureSelected(tenants: Tenant[] = []): void {
    const selected = tenants.find(t => t.id === this.selectedTenantValue?.id) || this.selectedTenantValue;
    if (selected) {
      this.tenants = [...new Set([...tenants, selected])];
    } else {
      this.tenants = tenants;
    }
  }
}
