import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../service/product-service';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Product } from '../model/product-model';



@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})

export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  products = [];
  buttonAddUpd = 'Add';
  updateID;
  count;
  constructor(private productService: ProductService) { }

  // Template based HTML 

  ngOnInit() {
    this.productForm = new FormGroup({
    'productname': new FormControl(null, Validators.required),
    'productdesc': new FormControl(null),
    'productcategory': new FormControl(null, Validators.required),
    'productcost': new FormControl(null, Validators.required),
    'productscost': new FormControl(null, Validators.required),
    'productsize': new FormControl(null, Validators.required),
    'productcount': new FormControl(null),

    });

    this.productService.productUpdated.subscribe(
      (result: any) => {
        this.updateID = result[0]._id;
        this.buttonAddUpd = 'Update';
        this.productForm.patchValue({
          'productname': result[0].name,
          'productdesc': result[0].description,
          'productcategory': result[0].category,
          'productcost': result[0].price,
          'productscost':result[0].sellingprice,
          'productsize':result[0].size
        });
      }
    );
  }
// On click on Reset, form will be cleared
  onReset() {
    this.productForm.reset();
    this.products = [];
    this.buttonAddUpd = 'Add';
  }

  onBulkInsert()
  {
    this.count = this.productForm.get('productcount').value;
    console.log(this.count);
    for(var i=0;i<this.count;i++)
    {
    this.products.push(
      {
        name: this.productForm.get('productname').value,
        description: this.productForm.get('productdesc').value,
        category: this.productForm.get('productcategory').value,
        price: this.productForm.get('productcost').value,
        sellingprice: this.productForm.get('productscost').value,
        size: this.productForm.get('productsize').value
      });
      
      if (this.buttonAddUpd === 'Add') {
        this.productService.createProduct(this.products).subscribe(
          (response) => {
            this.productService.productAdded.emit('Successfully added');
          },
          (error) => console.log(error));
        }
      }
  // Update if button name is update
      if (this.buttonAddUpd === 'Update') {
        this.products.push(
          {
            name: this.productForm.get('productname').value,
            description: this.productForm.get('productdesc').value,
            category: this.productForm.get('productcategory').value,
            price: this.productForm.get('productcost').value,
            sellingprice: this.productForm.get('productscost').value,
            size: this.productForm.get('productsize').value,
          });
  
        this.productService.updateProduct(this.products,this.updateID).subscribe(
          (response) => {
            console.log(response);
            this.productService.productAdded.emit('Successfully added');
            
          },
          (error) => console.log(error));
  
        this.productForm.reset();
        this.products = [];
        this.buttonAddUpd = 'Add';
        }
  }

  // On click on Add, product will be added to Mongo DB using node and express framework
  onAddProduct() {
    this.products.push(
      {
        name: this.productForm.get('productname').value,
        description: this.productForm.get('productdesc').value,
        category: this.productForm.get('productcategory').value,
        price: this.productForm.get('productcost').value,
        sellingprice: this.productForm.get('productscost').value,
        size: this.productForm.get('productsize').value
      });
// update if button name is Add
    if (this.buttonAddUpd === 'Add') {
      this.productService.createProduct(this.products).subscribe(
        (response) => {
          this.productService.productAdded.emit('Successfully added');
        },
        (error) => console.log(error));

      this.productForm.reset();
      this.products = [];
      }
// Update if button name is update
    if (this.buttonAddUpd === 'Update') {
      this.products.push(
        {
          name: this.productForm.get('productname').value,
          description: this.productForm.get('productdesc').value,
          category: this.productForm.get('productcategory').value,
          price: this.productForm.get('productcost').value,
          sellingprice: this.productForm.get('productscost').value,
          size: this.productForm.get('productsize').value,
        });

      this.productService.updateProduct(this.products,this.updateID).subscribe(
        (response) => {
          console.log(response);
          this.productService.productAdded.emit('Successfully added');
          
        },
        (error) => console.log(error));

      this.productForm.reset();
      this.products = [];
      this.buttonAddUpd = 'Add';
      }
  }
}
