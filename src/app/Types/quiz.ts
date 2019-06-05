export class Quiz {
  id?: string;
  question: string;
  options: string[];
  correctAns: string;
  solutionDesc: string;
  answered?: string[];
  wrongs?: string[];
}
