"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Calculator, Brain, Sparkles } from "lucide-react";
import { solveMathProblem, solveMathFromImage } from "./actions";
import { useActionState } from "react";

export default function MathSolver() {
  const [textState, textAction, textPending] = useActionState(
    solveMathProblem,
    null
  );
  const [imageState, imageAction, imagePending] = useActionState(
    solveMathFromImage,
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageSubmit = async (formData: FormData) => {
    if (selectedFile) {
      formData.append("image", selectedFile);
      imageAction(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MathSolver AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Solve complex math problems instantly using AI. Upload an image or
            type your problem directly.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Type Problem
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>

            {/* Text Input Tab */}
            <TabsContent value="text">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Type Your Math Problem
                  </CardTitle>
                  <CardDescription>
                    Enter any math problem - from basic arithmetic to advanced
                    calculus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={textAction} className="space-y-4">
                    <div>
                      <Label htmlFor="problem">Math Problem</Label>
                      <Textarea
                        id="problem"
                        name="problem"
                        placeholder="e.g., Solve for x: 2x + 5 = 15, or Find the derivative of x^2 + 3x + 2"
                        className="min-h-[120px] mt-2"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={textPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {textPending ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Solving...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Solve Problem
                        </>
                      )}
                    </Button>
                  </form>

                  {textState && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Solution:
                      </h3>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {textState.solution}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Image Upload Tab */}
            <TabsContent value="image">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                    Upload Math Problem Image
                  </CardTitle>
                  <CardDescription>
                    Take a photo or upload an image of your handwritten or
                    printed math problem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={handleImageSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="image">Choose Image</Label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2"
                        required
                      />
                    </div>

                    {selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Selected file: {selectedFile.name}
                        </p>
                        <div className="relative">
                          <img
                            src={
                              URL.createObjectURL(selectedFile) ||
                              "/placeholder.svg"
                            }
                            alt="Selected math problem"
                            className="max-w-full h-auto max-h-64 rounded-lg border"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={imagePending || !selectedFile}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {imagePending ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Solve from Image
                        </>
                      )}
                    </Button>
                  </form>

                  {imageState && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2">
                        Solution:
                      </h3>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {imageState.solution}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">All Math Levels</h3>
              <p className="text-gray-600 text-sm">
                From basic arithmetic to advanced calculus and beyond
              </p>
            </Card>

            <Card className="text-center p-6 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Image Recognition</h3>
              <p className="text-gray-600 text-sm">
                Upload photos of handwritten or printed problems
              </p>
            </Card>

            <Card className="text-center p-6 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI provides step-by-step solutions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
