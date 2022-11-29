import { FormControl, Validator } from "@angular/forms";
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
    defaultValue$?: Observable<T>,
    validators?: any[]
): AutocompleteLogic<T> => {

    // Return object to be populated
    const r = {
        control: new FormControl(''),
        optionSet: new Set<string>(),
        array: [],
        filteredArray$: of([]) // Dummy observable so that TS doesn't complain
    };

    // If defaultValue$ is provided, then set it to the control
    if (defaultValue$)
        defaultValue$.pipe(
            filter(value => !!value),
            take(1)
        ).subscribe((value: any) => r.control.setValue(value));

    r.filteredArray$ = array$.pipe(
        map(array => {

            // Clear and populate optionSet
            r.optionSet.clear();
            array.map(item =>
                r.optionSet.add(
                    item[trackByKey]
                )
            );

            // There's always at least the set-has validator
            let _validators = [
                _control => {
                    const valueFound = r.optionSet.has(_control.value[trackByKey]);
                    if (_control.value === '' || valueFound)
                        return null;
                    return { [controlName]: 'Non trovato' };
                }
            ];

            // If an array of validators is provided, then spread them inside _validators
            if (validators)
                _validators = [..._validators, ...validators];

            // Dynamically set validators
            r.control.setValidators(_validators);

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
                        debounceTime(200),
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