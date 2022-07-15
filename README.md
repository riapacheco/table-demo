**Searchable / Sortable Table in Angular (No Material or MatSort) with Useful Directives, JS Methods, SCSS, and Virtual Scrolling**

[toc]

# Create the App

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

## Utility Classes and Colors with @riapacheco/yutes
To keep this post high-level, we'll borrow my `@riapacheco/yutes` package's _utility_ classes (get it?) and access a seasonal stylesheet for colors only. We'll shape the table from scratch and add critical functionality without touching any other external libraries. This is likely a very strange concept to any React devs that might be reading this. ;)

```bash
npm install @riapacheco/yutes
```

And in your `styles.scss` file, add the following:

```scss
@import "~@riapacheco/yutes/main.scss"; // Strips webkit / default browser styles
@import "~@riapacheco/yutes/season/two.scss"; // Access colors

html,
body {
  background-color: $midnight-dark;
  background-image: linear-gradient(
    to bottom right,
    $gunmetal-dark,
    $midnight-dark
  );
  background-attachment: fixed; // fixes gradient to viewport
  color: $steel-regular; // font colors
}
```

## Access Directives with CommonModule

Now we'll add the `CommonModule` to access directives. Add the following to your `app.module.ts` file:

```typescript
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
// Add this ⤵️
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // ⤵️ and this
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

---

# JSON Data Setup

### Generate a Data Table Component

First, let's create a separate component so that our `app-root` acts as a wrapper. In your terminal, run the following:

```bash
ng g c components/data-table
```

Once that's generated, replace the content in your `app.component.html` file with its selector and add a wrapper to make things easier on our eyes as we evolve the structure:

```html
<!-- app.component.html -->
<div class="mx-auto-900px pt-5">
  <app-data-table></app-data-table>
</div>
```
##### @riapacheco/yutes classes
* `mx-auto-900px` sets the width of the container to the number indicated in the class (in pixels)
  * This shorthand class allows you to set a width anywhere from `1px` to `3000px`
* `pt-5` adds `5rem` [`rem` being a multiple of your base font-size] to the top of the container

When you run `ng serve` this should appear in your browser:

![preview of data table works](https://firebasestorage.googleapis.com/v0/b/riapi-65069.appspot.com/o/Screen%20Shot%202022-07-14%20at%209.12.57%20PM.png?alt=media&token=f89cc512-3f4e-4f9a-bf1d-8bb1361edece)

## Enable the Consumption of JSON Data

Since we want the table to handle a **lot** of data, we'll store some mock data in a local `json` file and import it into our component as though it were an external data source call.

### Add a Mock Data File and Access it with TypeScript's resolveJsonModule
1. Create a file called `data.json` in your main `app` folder and populate it with [this data](https://github.com/riapacheco/table-demo/blob/main/src/app/data.json) (pulled from Binance's open API)
2. To enable the app to read the data, add `"resolveJsonModule": true` under `compilerOptions` in your `tsconfig.ts` file like this:

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... other options
    "resolveJsonModule": true
  }
}
```

### Import to Component via File Path 

Now we can import the data from its file path and assign it to an initialized array called `cryptocurrencies`. Add the following:

```typescript
// data-table.component.ts

import { Component, OnInit } from "@angular/core";
// import the file like this ⤵️
import * as data from "../../data.json";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
})
export class DataTableComponent implements OnInit {
  // Assign like this ⤵️
  cryptocurrencies: any = (data as any).default;

  constructor() {}
  ngOnInit(): void {}
}
```

> Note: this is a great way to make an "instant" blog if you ever wanted to do that

# Create and Structure the Table
Now we can create the actual table, and in a way that dynamically accepts the data we just imported. First, add the following to your template:
```html
<!--data-table.component.html-->
<!-- ----------------------------- HEADER ROW ------------------------------ -->
<tr class="table-row header">
  <th>Symbol</th>
  <th>Ask Price</th>
  <th>Count</th>
  <th>Bid Price</th>
  <th>Low Price</th>
  <th>High Price</th>
</tr>

<!-- ------------------------------ DATA ROWS ------------------------------ -->
<table>
  <tr class="table-row data">

  </tr>
</table>
```
Though the first header row (`table-row header`) isn't actually _inside_ the the `<table>` element, our styling will ensure that they always align. We keep the header row _outside_ of the table so that it doesn't scroll out of view when we restrict the container's height.

## Populating Dynamic Cells
Now we can add the data dynamically for each row using Angular's `*ngFor` directive. Remember to ensure that the order of data types listed matches the headings we created earlier (there are 6 in total):
```html
<!--data-table.component.html-->

<!-- ... code we added earlier -->

<!-- ------------------------------ DATA ROWS ------------------------------ -->
<table>
  <!-- ⤵️ add this -->
  <tr *ngFor="let crypto of cryptocurrencies"
    class="table-row data">
    <td>
      {{ crypto.symbol | uppercase }} <!--Angular's `uppercase` pipe-->
    </td>
    <td>
      {{ crypto.askPrice }}
    </td>
    <td>
      {{ crypto.count }}
    </td>
    <td>
      {{ crypto.bidPrice }}
    </td>
    <td>
      {{ crypto.lowPrice}}
    </td>
    <td>
      {{ crypto.highPrice}}
    </td>
  </tr>
</table>
```
If you run the app locally, you'll see that there's a _lotta data_ (and it looks like a mess).

![lots of data](https://ik.imagekit.io/fuc9k9ckt2b/Blog_Post_Images/Dev_to/FirstLoadUpCryptoData_hj7Ye_DfL.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1657859583914)

---

# Responsive Structuring with SCSS 
At first glance, we might want to structure the table by restricting cell widths in a way that uniformly aligns every header cell with those populated data cells below them. 

The problem is that this restricts the width of the table overall and will prohibit it from filling the full area of whatever wrapper it's contained in. 

Instead, we turn to **flexbox** aka _my precious_. In the `app.component.scss` file, we'll complete the following tasks:
* Ensure the width of the the overall table inherits the viewport
* Enable adjustments to "columns" from within the component itself

Add the following (read comments for more details):
```scss
// data-table.component.scss

@import '~@riapacheco/yutes/season/two.scss';

$column-spacing: 1rem;    // For easier updating later
table { width: 100%; }    // Expands the template's parent element

/* -------------------------- STRUCTURAL PROPERTIES ------------------------- */
// STYLES APPLIED TO BOTH TABLE-ROWS
tr {
  width: 100%;
  height: 2.5rem;         // Emphasize the header row more
  display: flex;          // Spread header row
  align-items: center;    // WITHOUT losing vertical text centering

  // Enclosed Cells
  th, td {
    cursor: pointer;
    text-align: center;

    // Solves issue of growing into parent wrappers
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;

    // How the $column-spacing var we created acts as "column" spacing: math.
    margin-left: $column-spacing / 2;
    margin-right: $column-spacing / 2;
    &:first-child { margin-left: none; }    // Removes left margin from very left column
    &:last-child { margin-right: none; }    // Removes right margin from very right column
  }
}
```
The table is now taking shape!

![table structuring](https://firebasestorage.googleapis.com/v0/b/riapi-65069.appspot.com/o/blog%2FFirstLoadUpCryptoData.gif?alt=media&token=f83c720e-e53d-490b-bfb3-9585cea6f8d3)

## Fancy Basic Styling
Now that we got the general structure out of the way, we'll:
1. Differentiate the header row from the rest of the table
2. We'll add a background color to every other row in our data rows

Add the following to the component's stylesheet:
```scss
// data-table.component.scss

@import '~@riapacheco/yutes/season/two.scss';

$column-spacing: 1rem;    // For easier updating later
table { width: 100%; }    // Expands the template's parent element

/* -------------------------- STRUCTURAL PROPERTIES ------------------------- */
// STYLES APPLIED TO BOTH TABLE-ROWS
tr {
  // .. stuff added earlier
}

/* --------------------------- HEADER ROW STYLING --------------------------- */
.table-row.header {
  background-color: $midnight-dark;   // Adds a nice darker background
  border-radius: 6px 6px 0 0;         // Rounds the top-left and top-right corners

  // Typical header styling
  font-size: 0.8rem;                  // Smaller and
  font-weight: 500;                   // less thick font
  text-transform: uppercase;          // Uppercase and
  letter-spacing: 0.07rem;            // spaced like a subheading
  color: $soot-grey-medium;           // Subtle color
}
/* ---------------------------- DATA ROW STYLING ---------------------------- */
.table-row.data {
  &:nth-child(even) {                   // Adds BG color to every other CHILD element
    background-color: $gunmetal-dark;
  }
}
```

Now run your app, and check it out!

![header added to table](https://firebasestorage.googleapis.com/v0/b/riapi-65069.appspot.com/o/blog%2FScreen%20Shot%202022-07-14%20at%2010.15.26%20PM.png?alt=media&token=fce9d298-4747-488d-be95-30413cf4cc38)

# Performance-Improving Scroll Windows
One core tool we'll pull from Angular's CDK is is it's `virtual scroll` viewport. This creates a height-restricted view that only renders data that's visible in the viewport, which drastically improves performance.
Import the CDK package from Angular by running the following in your terminal:
```bash
npm install @angular/cdk
```

And import the `ScrollingModule` to your `app.module.ts` file (and add it to the `imports` array):
```typescript
// app.module.ts
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './components/data-table/data-table.component';
import { NgModule } from '@angular/core';
// Import this ⤵️
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // ⤵️ and add this
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Virtual Scroll Viewport
Now we'll wrap the `table-row data` element with the `<cdk-virtual-scroll-viewport>` selector. For this to properly render, we add an `[itemSize]` value to the selector itself and specify a restricted height. 
* The `itemSize` represents what height the feature should expect of each row
* To specify height, we can use Angular's handy `[style]` directive. Both of these can bind values directly from the component.
First, let's add those values to the component itself:

```typescript
// data-table.component.ts

// ... other code

export class DataTableComponent implements OnInit {
  cryptocurrencies: any = (data as any).default;

  /* ------------------------ VIRTUAL SCROLL PROPERTIES ----------------------- */
  itemSize = '2.5rem';        // Can accept pixels and ems too
  viewportHeightPx = 500;

  constructor() { }

  ngOnInit(): void {
  }

}
```

And apply them to the wrapping selector in the template:
```html
<!-- ------------------------------ DATA ROWS ------------------------------ -->
<table>

  <!-- ⤵️ Add the viewport here with our bounded elements -->
  <cdk-virtual-scroll-viewport 
    [itemSize]="itemSize" 
    [style.height]="viewportHeightPx + 'px' ">
    
    <tr
      *ngFor="let crypto of cryptocurrencies"
      class="table-row data">

      <!-- ... cell code -->

    </tr>
  </cdk-virtual-scroll-viewport>
</table>
```
I realize that having a local file with THAT much data might still reflect performance issues. But, it ain't too bad for what it is:
