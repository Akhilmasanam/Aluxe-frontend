import { Component, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-group">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <input
        #inputElement
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [class.error]="error"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <span *ngIf="error" class="error-message">{{ error }}</span>
      <span *ngIf="helperText" class="helper-text">{{ helperText }}</span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  styles: [`
    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1f1f1f;
      font-size: 0.95rem;
    }

    input {
      padding: 0.75rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      color: #1f1f1f;
      transition: all 300ms ease-out;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-color: #ffd764;
        box-shadow: 0 0 0 3px rgba(255, 215, 100, 0.1);
      }

      &.error {
        border-color: #f44336;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
      }

      &:disabled {
        background-color: #fafafa;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .helper-text {
      color: #666;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() error = '';
  @Input() helperText = '';
  @ViewChild('inputElement') inputElement!: ElementRef;

  value = '';
  private onChange: (value: any) => void = () => {};
 onTouched: () => void = () => {};
  disabled = false;

  // ControlValueAccessor implementation
  writeValue(obj: any): void {
    this.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }

  onInputChange(event: any) {}
  onInputBlur(event: any) {}
}
