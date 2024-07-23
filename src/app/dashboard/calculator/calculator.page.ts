/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {
  // Basic Calculator
  status = 'Basic Calculator';
  basicCalculator = 'ON';
  isBasicCalculatorOn = false;
  isBasicCalculatorOperandAdded = false;
  basicCalculatorExpression = '';
  // Brick Calculator
  brickCalculator: FormGroup;
  brickCalculatorBricksNeeded = 0;
  // Concrete MixSite Calculator
  concreteMixSiteCalculator: FormGroup;
  concreteMixOnSiteTotal = 0;

  customActionSheetOptions: any = {
    header: 'Calculator',
    subHeader: 'Please select one calculator below:'
  };

  constructor(
    private toastController: ToastController,
    private formBuilder: FormBuilder) { }

  // Brick Calculator
  get wallWidth(){
    return this.brickCalculator.get('wallWidth');
  }

  get wallHeight() {
    return this.brickCalculator.get('wallHeight');
  }

  // Concrete MixSite Calculator
  get mixOnSiteWidth(){
    return this.concreteMixSiteCalculator.get('mixOnSiteWidth');
  }

  get mixOnSiteLength() {
    return this.concreteMixSiteCalculator.get('mixOnSiteLength');
  }

  get mixOnSiteDepth() {
    return this.concreteMixSiteCalculator.get('mixOnSiteDepth');
  }

  ngOnInit() {
    // Brick Calculator
    this.brickCalculator = this.formBuilder.group({
      wallWidth: ['', [Validators.required, Validators.minLength(1)]],
      wallHeight: ['', [Validators.required, Validators.minLength(1)]],
    });

    // Concrete MixSite Calculator
    this.concreteMixSiteCalculator = this.formBuilder.group({
      mixOnSiteWidth: ['', [Validators.required, Validators.minLength(1)]],
      mixOnSiteLength: ['', [Validators.required, Validators.minLength(1)]],
      mixOnSiteDepth: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  // Basic Calculator

  toggleCalculator() {
    if (this.basicCalculator === 'ON') {
      this.basicCalculator = 'OFF';
      this.isBasicCalculatorOn = true;
    } else {
      this.basicCalculator = 'ON';
      this.isBasicCalculatorOn = false;
    }
  }

  appendText(element: string) {
    if (!this.isBasicCalculatorOn) {
      this.presentToast(this.status + ' is currently switched off!');
      return;
    }

    const basicCalculatorInput = document.getElementById('basicCalculatorInput');

    // Error:
    if (((element === '/') || (element === 'x') ||
        (element === '-') || (element === '+')) &&
        (basicCalculatorInput.innerText === '')) {
          this.presentToast('Error! Enter any number before adding an operand.');
          return;
    }

    // Add 0 before adding a .
    if ((element === '.') && (basicCalculatorInput.innerText === '')) {
        basicCalculatorInput.innerText = '0' + element;
        return;
    }

    // Add space before adding operand
    if ((element === '/') || (element === 'x') ||
        (element === '-') || (element === '+')) {
          basicCalculatorInput.innerText += ' ' + element;
          this.isBasicCalculatorOperandAdded = true;
          return;
    }

    //  Add space before adding '=' and calculate()
    if (element === '=') {
        basicCalculatorInput.innerText += ' ' + element + ' ';
        this.calculate();
        return;
    }

    // Add data into input canvas
    if (!this.isBasicCalculatorOperandAdded) {
      basicCalculatorInput.innerText += element;
    } else {
      basicCalculatorInput.innerText += ' ' + element;
    }

    this.isBasicCalculatorOperandAdded = false;
  }

  calculate() {
    const basicCalculatorInput = document.getElementById('basicCalculatorInput');
    let calculatorInput = basicCalculatorInput.innerText.split(' ');
    let answer = 0;

    for (let i = 0; i < calculatorInput.length; i++) {
      if (i === 0) {
        answer = parseFloat(calculatorInput[i]);
      }

      if (i % 2 !== 0) {
        switch(calculatorInput[i]) {
          case '/':
              answer /= parseFloat(calculatorInput[i + 1]);
              i++;
          break;
          case 'x':
              answer *= parseFloat(calculatorInput[i + 1]);
              i++;
          break;
          case '-':
              answer -= parseFloat(calculatorInput[i + 1]);
              i++;
          break;
          case '+':
              answer += parseFloat(calculatorInput[i + 1]);
              i++;
          break;
        }
      }
    }

    this.basicCalculatorExpression = basicCalculatorInput.innerText + ' ' + answer;
    basicCalculatorInput.innerText = answer.toString();
    calculatorInput = [];
  }

  clearInput() {
    document.getElementById('basicCalculatorInput').innerText = '';
    this.basicCalculatorExpression = '';
  }

  // Brick Calculator
  brickCalculateBricksNeeded() {
    this.brickCalculatorBricksNeeded = +this.wallWidth.value * +this.wallHeight.value;
  }

  brickCalculatorReset() {
    this.brickCalculatorBricksNeeded = 0;
    this.brickCalculator.reset();
  }

  // Concrete MixSite Calculator

  concreteMixSiteCalculate() {
    console.log('Calculating...');
    this.concreteMixOnSiteTotal = (+this.mixOnSiteWidth.value * +this.mixOnSiteLength.value * +this.mixOnSiteDepth.value) / 1000000;
    console.log(this.concreteMixOnSiteTotal);
  }

  concreteMixSiteCalculatorReset() {
    this.concreteMixSiteCalculator.reset();
  }

  async presentToast(toatMessage: string) {
    const toast = await this.toastController.create({
      message: toatMessage,
      duration: 1000,
      icon: 'information',
      color: 'dark'
    });
    toast.present();
  }

}
