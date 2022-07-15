# Searchable / Sortable Table in Angular using Basic Directives and JS Methods


#### Create the App
```bash
ng new custom-table-demo --skip tests
```
When prompted:

```bash
? Would you like to add Angular routing? (y/N) N
```
```bash
? Which stylesheet format would you like to use? 
  CSS 
❯ SCSS   [ https://sass-lang.com/documentation/syntax#scss                ] 
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ] 
  Less   [ http://lesscss.org                                             ] 
```
# Some Dependency Setup
To keep this post high-level, we'll borrow my `@riapacheco/yutes` package's utility classes (get it?) and access a seasonal stylesheet for colors only. We'll shape the table from scratch (and add functionality without touching a library).
```bash
npm install @riapacheco/yutes
```
And in your `styles.scss` file, add the following:
```scss
@import '~@riapacheco/yutes/main.scss'; // Strips webkit / default browser styles
@import '~@riapacheco/yutes/season/two.scss'; // Access colors

html, body {
  background-color: $midnight-dark;
  background-image: linear-gradient(to bottom right, $gunmetal-dark, $midnight-dark);
  background-attachment: fixed; // fixes gradient to viewport
  color: $steel-regular; // font colors
}
```
#### CommonModule
Now we'll add the `CommonModule` to access directives. Add the following to your `app.module.ts` file:
```typescript
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
// Add this ⤵️
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // ⤵️ and this
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


```

---

# Create Component with Data
First, let's create a separate component so that our `app-root` acts as a wrapper. In your terminal, run the following:
```bash
ng g c components/data-table
```
Once that's generated, replace the content in your `app.component.html` file with its selector
```html
<!-- app.component.html -->
<app-data-table></app-data-table>
```
When you run `ng serve` this should appear in your browser:
![preview of data table works](https://firebasestorage.googleapis.com/v0/b/riapi-65069.appspot.com/o/Screen%20Shot%202022-07-14%20at%208.47.56%20PM.png?alt=media&token=c6b467e6-78a8-4afe-b6c2-c8cc9185b926)

### Adding Data
Since we want to work with a lot of data in this table, we'll store data in a local `json` file and import it to our component as though it were an external data source.
1. Create a file called `data.json` in your main `app` folder and populate it with 
2. Add the `"resolveJsonModule": true` under `compilerOptions` in your `tsconfig.ts` file like this:
```json
// tsconfig.json
{
  "compilerOptions": {
    // ... other options
    "resolveJsonModule": true
  }
}
```

