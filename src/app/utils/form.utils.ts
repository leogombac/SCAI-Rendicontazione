import { FormControl } from "@angular/forms";
import { combineLatest, debounceTime, distinctUntilChanged, filter, isObservable, map, Observable, of, startWith, switchMap, take } from "rxjs";

export interface AutocompleteFilterFn<T> {
    (item: T, value: string): boolean;
};    

export interface AutocompleteLogic<T> {
    control: FormControl;
    optionSet: Set<string>;
    array: T[];
    filteredArray$: Observable<T[]>;
}

// This function creates the logic for an autocomplete
export const createAutocompleteLogic = <T>(
    controlName: string,
    array$: Observable<T[]>,
    trackByKey,
    filterFunction,
    defaultValue: Observable<string | number> | string | number = '',
    validators = []
): AutocompleteLogic<T> => {

    // Return object to be populated
    const r = {
        control: new FormControl(''),
        optionSet: new Set<string>(),
        array: [],
        filteredArray$: of([]) // Dummy observable so that TS doesn't complain
    };

    // Set defaultValue in control
    const _defaultValue = !isObservable(defaultValue)
        ? of(defaultValue)
        : defaultValue;
    _defaultValue.pipe(
        filter(value => !!value),
        take(1)
    ).subscribe(value => r.control.setValue(value+''));

    r.filteredArray$ = array$.pipe(
        map(array => {

            // Clear and populate optionSet
            r.optionSet.clear();
            array.map(item =>
                r.optionSet.add(
                    item[trackByKey]
                )
            );

            // Dynamically set validators
            r.control.setValidators(
                [
                    _control => {
                    const valueFound = r.optionSet.has(_control.value);
                    if (_control.value === '' || valueFound)
                        return null;
                    else
                        return { [controlName]: 'Non trovato' };
                    },
                    ...validators // Pass other given validators
                ]
            );

            // Force first validation
            r.control.updateValueAndValidity();

            r.array = array;
            return array;
        }),
        switchMap(array =>
            combineLatest([
                of(array),
                r.control.valueChanges
                    .pipe(
                        startWith(''),
                        debounceTime(100),
                        distinctUntilChanged(),
                    )
            ])
        ),
        map(([ array, value ]) =>
            array.filter(item => filterFunction(item, value))
        )
    );

    return r;
};