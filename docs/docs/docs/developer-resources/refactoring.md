---
id: refactoring-guidelines
title: Refactoring Guidelines
slug: /developer-resources/refactoring-guidelines
sidebar_position: 35
---

From time to time the code base will need to be refactored. Use this page to guide your updates when this activity is required.


## Before You Begin

It's important to consider these factors before you start.

### Understand the Code Before Changing

   1. Thoroughly understand the existing code's purpose and functionality before attempting to refactor it.

   2. Identify areas for improvement and define clear refactoring goals. 

### Refactor in Small, Incremental Steps

   1. Avoid large, sweeping changes. Break down refactoring into small, manageable tasks and PRs.

   2. Commit changes often: to track progress and easily revert if issues arise. 

### Prioritize Testing
    
    1. Write comprehensive unit tests before refactoring to ensure the code's behavior remains consistent after changes.

    1. Run tests frequently during and after refactoring to catch regressions early. 

### Separate Refactoring from Feature Development

Avoid mixing refactoring with new feature development: in the same commit or branch to maintain clarity and ease debugging.

## Best Practices

Follow these guidelines for writing reusable TypeScript code.

### Embrace Modularity

1. Organize your code into well-defined modules, each responsible for a specific concern. This promotes separation of concerns, making components easier to understand, test, and reuse independently.

1. Additionally, keep your types/interfaces in a separate folder to maintain a clean and organized codebase. This modular approach not only makes your code easier to manage but also improves scalability.

```
src/
│
├── types/
│   ├── product.ts
│   └── cart.ts
│
├── modules/
│   ├── product.ts
│   └── cart.ts
│
├── index.ts
```

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// modules/product.ts
import { Product } from '../types/product';
import { CartItem } from '../types/cart';
export function getProductDetails(id: string): Product {
  // Implementation here
}

// types/cart.ts
import { Product } from './product';
export interface CartItem {
  product: Product;
  quantity: number;
}

// modules/cart.ts
import { CartItem } from '../types/cart';
import { Product } from '../types/product';
export function addToCart(product: Product, quantity: number): CartItem {
  // Implementation here
  return { product, quantity };
}
```

### Focus on Readability and Maintainability

1. **Maintain Consistent Naming Conventions and Code Style:** Adhere to established naming conventions for variables, functions, and types, and use consistent code formatting. This enhances readability and makes it easier to navigate and understand the codebase.

2. **Break down complex functions:** Use smaller, more focused units.

3. **Eliminate code duplication:** Extracti common logic into reusable functions or components.

4. **Use appropriate data types:** Leverage TypeScript's type system for enhanced type safety and clarity. 

### Document Your Code:

Use TSDoc comments to document functions, classes, and interfaces, explaining their purpose, parameters, and return values. This improves code readability and makes it easier for others (and your future self) to understand and use your reusable components.

### Leverage TypeScript's Features

There are many useful practices that you should consider when writing TypeScript code for our repositories. These include the following:

1. **Utilize Generics:** By using generics, you create a scalable and maintainable foundation for your application, allowing for easy expansion and modification as your business needs evolve. Employ generics to create functions, classes, and interfaces that can work with various data types without sacrificing type safety. This allows you to write a single piece of logic that adapts to different inputs. 
   1. Here is an itemized list of advantages:
      1. Code Reusability: The same interface can be implemented for different types, reducing duplication.
      2. Type Safety: TypeScript ensures that the correct types are used in each implementation.
      3. Flexibility: You can easily create new repositories for new entities without writing redundant code.
      4. Consistency: All repositories follow the same structure, making the codebase more predictable and easier to maintain.

   2. Generics allow you to write a single piece of logic that adapts to different inputs.
   
        ```typescript
            function identity<T>(value: T): T {
                return value;
            }
        ```

      1. For instance, a generic Repository interface can handle different entities like products, orders, or customers.

            ```typescript
            interface Repository<T> {
            getById(id: string): Promise<T>;
            getAll(): Promise<T[]>;
            create(item: T): Promise<void>;
            update(id: string, item: Partial<T>): Promise<void>;
            delete(id: string): Promise<void>;
            }

            class ProductRepository implements Repository<Product> {
            // Implementation here
            }

            class OrderRepository implements Repository<Order> {
            // Implementation here
            }
            ```

1. **Define Clear Interfaces and Types:** Use interfaces to define the shape of objects and types for complex data structures. This provides clear contracts for how data should be structured, promoting consistency and easier integration. 

```typescript
    interface User {
        id: string;
        name: string;
        email: string;
    }
```

3. **Use Utility Types:** Take advantage of TypeScript's built-in utility types like Partial, Readonly, Pick, and Omit to create new types based on existing ones, simplifying complex type manipulations and promoting code reuse in type definitions. 

```typescript
    // Makes all properties of User optional
    type OptionalUser = Partial<User>; 
```

4. **Implement Type Guards:** Use type guards to perform runtime type checking, ensuring your code handles different types correctly and safely within conditional blocks

```typescript
    function isNumber(value: unknown): value is number {
        return typeof value === 'number';
    }
```

5. **Consider using enums:** When sets of related constants are used

6. **Use access modifiers:** Consider (public, private, protected) modifier for better encapsulation in classes. 

7. **Avoid `any`** Minimize the use of the `any` type as it defeats the purpose of TypeScript's type safety. Strive to provide explicit types or leverage type inference where possible.
