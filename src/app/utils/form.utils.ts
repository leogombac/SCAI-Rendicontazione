import { FormControl } from "@angular/forms";
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from "rxjs";

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
    filterKey: string,
    defaultValue = '',
    validators = []
): AutocompleteLogic<T> => {

    // Return object to be populated
    const r = {
        control: new FormControl(defaultValue),
        optionSet: new Set<string>(),
        array: [],
        filteredArray$: of([]) // Dummy observable so that TS doesn't complain
    };

    r.filteredArray$ = array$.pipe(
        map(array => {

            // Clear and populate optionSet
            r.optionSet.clear();
            array.map(item =>
                r.optionSet.add(
                    item[filterKey].toString()
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

            // Filter array with a regular expression
            array.filter(item =>
                new RegExp(value, 'i')
                    .test(item[filterKey].toString())
            )
        )
    );

    return r;
};