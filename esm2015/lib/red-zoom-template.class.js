const ɵ0 = () => {
    let template = null;
    return () => {
        if (!template) {
            template = document.createElement('template');
            template.innerHTML = `<div class="red-zoom">
                <div class="red-zoom__overlay"></div>
                <div class="red-zoom__frame">
                    <div class="red-zoom__frame-body"></div>
                </div>
                <div class="red-zoom__lens">
                    <div class="red-zoom__lens-body"></div>
                </div>
                <div class="red-zoom__error">
                    <div class="red-zoom__error-message"></div>
                </div>
            </div>`;
        }
        return template.content.cloneNode(true).firstChild;
    };
};
const makeTemplate = (ɵ0)();
export class RedZoomTemplate {
    constructor() {
        this._status = null;
        this.appliedClasses = [];
        this.onTransitionEnd = (event) => {
            if (event.propertyName === 'visibility' && this.isHidden) {
                this.template.remove();
            }
        };
        this.template = makeTemplate();
        this.lens = this.template.querySelector('.red-zoom__lens');
        this.lensBody = this.template.querySelector('.red-zoom__lens-body');
        this.frame = this.template.querySelector('.red-zoom__frame');
        this.frameBody = this.template.querySelector('.red-zoom__frame-body');
        this.error = this.template.querySelector('.red-zoom__error');
        this.errorMessage = this.template.querySelector('.red-zoom__error-message');
        this.template.addEventListener('transitionend', this.onTransitionEnd);
        this.status = 'loading';
    }
    set status(state) {
        if (this._status !== null) {
            this.template.classList.remove(`red-zoom--status--${this._status}`);
        }
        this._status = state;
        this.template.classList.add(`red-zoom--status--${state}`);
    }
    get status() {
        return this._status;
    }
    set classes(classes) {
        this.template.classList.remove(...this.appliedClasses);
        classes = classes.trim();
        if (classes) {
            this.appliedClasses = classes.replace(/ +/, ' ').split(' ');
            this.template.classList.add(...this.appliedClasses);
        }
    }
    get isHidden() {
        return getComputedStyle(this.template).visibility === 'hidden';
    }
    setProperties(properties) {
        for (let name in properties) {
            this.template.style.setProperty(name, properties[name]);
        }
    }
    detach() {
        this.template.classList.remove('red-zoom--active');
        if (this.isHidden) {
            this.template.remove();
        }
    }
    attach() {
        if (this.template.parentNode !== document.body) {
            document.body.appendChild(this.template);
        }
    }
    activate() {
        this.template.classList.add('red-zoom--active');
    }
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkLXpvb20tdGVtcGxhdGUuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXJlZC16b29tL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9yZWQtem9vbS10ZW1wbGF0ZS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiV0FHc0IsR0FBRyxFQUFFO0lBQ3ZCLElBQUksUUFBUSxHQUF3QixJQUFJLENBQUM7SUFFekMsT0FBTyxHQUFHLEVBQUU7UUFDUixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUMsUUFBUSxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7bUJBV2QsQ0FBQztTQUNYO1FBRUQsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUE0QixDQUFDO0lBQ3pFLENBQUMsQ0FBQztBQUNOLENBQUM7QUF0QkQsTUFBTSxZQUFZLEdBQUcsSUFzQm5CLEVBQUUsQ0FBQztBQUdMLE1BQU0sT0FBTyxlQUFlO0lBYXhCO1FBWkEsWUFBTyxHQUFrQixJQUFJLENBQUM7UUFVdEIsbUJBQWMsR0FBYSxFQUFFLENBQUM7UUFtRXRDLG9CQUFlLEdBQUcsQ0FBQyxLQUFzQixFQUFFLEVBQUU7WUFDekMsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN0RCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzFCO1FBQ0wsQ0FBQyxDQUFDO1FBcEVFLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxh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bVN0YXR1cyB9IGZyb20gJy4vcmVkLXpvb20tc3RhdHVzLnR5cGUnO1xuXG5cbmNvbnN0IG1ha2VUZW1wbGF0ZSA9ICgoKSA9PiB7XG4gICAgbGV0IHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50ID0gbnVsbDtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwicmVkLXpvb21cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmVkLXpvb21fX292ZXJsYXlcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmVkLXpvb21fX2ZyYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZWQtem9vbV9fZnJhbWUtYm9keVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZWQtem9vbV9fbGVuc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmVkLXpvb21fX2xlbnMtYm9keVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZWQtem9vbV9fZXJyb3JcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlZC16b29tX19lcnJvci1tZXNzYWdlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmZpcnN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgfTtcbn0pKCk7XG5cblxuZXhwb3J0IGNsYXNzIFJlZFpvb21UZW1wbGF0ZSB7XG4gICAgX3N0YXR1czogUmVkWm9vbVN0YXR1cyA9IG51bGw7XG5cbiAgICB0ZW1wbGF0ZTogSFRNTERpdkVsZW1lbnQ7XG4gICAgbGVuczogSFRNTERpdkVsZW1lbnQ7XG4gICAgbGVuc0JvZHk6IEhUTUxEaXZFbGVtZW50O1xuICAgIGZyYW1lOiBIVE1MRGl2RWxlbWVudDtcbiAgICBmcmFtZUJvZHk6IEhUTUxEaXZFbGVtZW50O1xuICAgIGVycm9yOiBIVE1MRGl2RWxlbWVudDtcbiAgICBlcnJvck1lc3NhZ2U6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBhcHBsaWVkQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gbWFrZVRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMubGVucyA9IHRoaXMudGVtcGxhdGUucXVlcnlTZWxlY3RvcignLnJlZC16b29tX19sZW5zJyk7XG4gICAgICAgIHRoaXMubGVuc0JvZHkgPSB0aGlzLnRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWQtem9vbV9fbGVucy1ib2R5Jyk7XG4gICAgICAgIHRoaXMuZnJhbWUgPSB0aGlzLnRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWQtem9vbV9fZnJhbWUnKTtcbiAgICAgICAgdGhpcy5mcmFtZUJvZHkgPSB0aGlzLnRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWQtem9vbV9fZnJhbWUtYm9keScpO1xuICAgICAgICB0aGlzLmVycm9yID0gdGhpcy50ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVkLXpvb21fX2Vycm9yJyk7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gdGhpcy50ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVkLXpvb21fX2Vycm9yLW1lc3NhZ2UnKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2xvYWRpbmcnO1xuICAgIH1cblxuICAgIHNldCBzdGF0dXMoc3RhdGU6IFJlZFpvb21TdGF0dXMpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZS5jbGFzc0xpc3QucmVtb3ZlKGByZWQtem9vbS0tc3RhdHVzLS0ke3RoaXMuX3N0YXR1c31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IHN0YXRlO1xuICAgICAgICB0aGlzLnRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoYHJlZC16b29tLS1zdGF0dXMtLSR7c3RhdGV9YCk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXR1cygpOiBSZWRab29tU3RhdHVzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcbiAgICB9XG5cbiAgICBzZXQgY2xhc3NlcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5jbGFzc0xpc3QucmVtb3ZlKC4uLnRoaXMuYXBwbGllZENsYXNzZXMpO1xuXG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKTtcblxuICAgICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICAgICAgdGhpcy5hcHBsaWVkQ2xhc3NlcyA9IGNsYXNzZXMucmVwbGFjZSgvICsvLCAnICcpLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoLi4udGhpcy5hcHBsaWVkQ2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaXNIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKHRoaXMudGVtcGxhdGUpLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nO1xuICAgIH1cblxuICAgIHNldFByb3BlcnRpZXMocHJvcGVydGllczoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9KTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGFjaCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5jbGFzc0xpc3QucmVtb3ZlKCdyZWQtem9vbS0tYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhdHRhY2goKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlLnBhcmVudE5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5jbGFzc0xpc3QuYWRkKCdyZWQtem9vbS0tYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgb25UcmFuc2l0aW9uRW5kID0gKGV2ZW50OiBUcmFuc2l0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ3Zpc2liaWxpdHknICYmIHRoaXMuaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIl19