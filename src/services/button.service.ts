import { Subject, Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

class ButtonClass {
    private _onDestroy: Subject<null> = new Subject();
    private buttons$$: Subject<HTMLGeniusButtonElement[]> = new Subject();

    public buttons$: Observable<HTMLGeniusButtonElement[]> = this.buttons$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));

    public setButtons(buttons: HTMLGeniusButtonElement[]) {
        this.buttons$$.next(buttons);
    }

    public destroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}

export const ButtonService = new ButtonClass();
