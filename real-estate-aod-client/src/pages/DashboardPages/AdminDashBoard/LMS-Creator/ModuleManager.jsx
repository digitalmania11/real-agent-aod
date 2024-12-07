'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, Link, FileVideo, FileIcon as FilePdf, ChevronDown, ChevronUp } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import axios from 'axios'

export function ModuleManager() {
  const [modules, setModules] = useState([
    { id: 1, title: '', submodules: ['', ''], resources: [] },
  ])
  const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const formRef = useRef(null)

  const addModule = () => {
    const newModule = { id: Date.now(), title: 'New Module', submodules: [], resources: [] }
    setModules([...modules, newModule])
  }

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const addSubmodule = (moduleId) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, submodules: [...module.submodules, 'New Submodule'] }
        : module
    ))
  }

  const addResource = (moduleId) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, resources: [...module.resources, { type: 'link', value: '' }] }
        : module
    ))
  }

  const updateResource = (moduleId, index, type, value) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            resources: module.resources.map((resource, i) => 
              i === index ? { type, value } : resource
            )
          }
        : module
    ))
  }

  const removeResource = (moduleId, index) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, resources: module.resources.filter((_, i) => i !== index) }
        : module
    ))
  }

// const axios = require("axios");

const handleFileUpload = async (moduleId, event, type) => {
  const file = event.target.files[0];
  console.log("file",file);
  if (file) {
    console.log("It Entered the file");
    // Define maximum size based on file type
    const maxSize = type === 'pdf' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for PDF, 50MB for video
    if (file.size > maxSize) {
      alert(`File size exceeds the limit (${maxSize / (1024 * 1024)}MB)`);
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('VideoPitch', file);
      formData.append('upload_preset',"akshay_waghmare");
      formData.append('cloud_name', cloud_name);

      console.log("Inspecting formData:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await axios.post('http://localhost:3000/api/v1/properties/video', formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        },
      })

      console.log('Upload successful:', response);

      // Update the module with the uploaded file data
      setModules(modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              resources: [
                ...module.resources,
                {
                  type: 'video',
                  value: response.data.videoUrl
                  , // Store URL from backend response
                  preview: response.data.videoUrl
                  , // Use backend URL for preview
                },
              ],
            }
          : module
      ));
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  }
};


  // Modify this Handle Submit Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting modules:", modules);
  
    try {
      const response = await axios.put('http://localhost:3000/api/v1/training-materials', { modules });
  
      if (response.status === 201) {
        alert('Modules saved successfully!');
      } else {
        throw new Error(`Failed to save modules. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving modules:', error);
      alert('Failed to save modules. Please try again.');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Card className="bg-white dark:bg-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-100">Module & Submodule Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={addModule} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Module
          </Button>
          {modules.map((module) => (
            <Accordion type="single" collapsible key={module.id} className="mb-4">
              <AccordionItem value={`module-${module.id}`}>
                <AccordionTrigger className="bg-blue-50 dark:bg-blue-700 p-4 rounded-t-lg">
                  <Input 
                    defaultValue={module.title} 
                    className="font-bold text-blue-800 dark:text-blue-100 bg-white dark:bg-blue-600"
                    onChange={(e) => {
                      setModules(modules.map(m => 
                        m.id === module.id ? { ...m, title: e.target.value } : m
                      ))
                    }}
                  />
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 dark:bg-blue-700 p-4 rounded-b-lg">
                  <Textarea 
                    placeholder="Module description..." 
                    className="mb-2 bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100"
                    onChange={(e) => {
                      setModules(modules.map(m => 
                        m.id === module.id ? { ...m, description: e.target.value } : m
                      ))
                    }}
                  />
                  {module.submodules.map((submodule, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input 
                        defaultValue={submodule} 
                        className="mr-2 bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100"
                        onChange={(e) => {
                          setModules(modules.map(m => 
                            m.id === module.id 
                              ? { ...m, submodules: m.submodules.map((sub, i) => i === index ? e.target.value : sub) }
                              : m
                          ))
                        }}
                      />
                      <Button 
                        type="button"
                        onClick={() => {
                          setModules(modules.map(m => 
                            m.id === module.id 
                              ? { ...m, submodules: m.submodules.filter((_, i) => i !== index) }
                              : m
                          ))
                        }}
                        variant="outline" 
                        size="icon" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addSubmodule(module.id)} variant="outline" size="sm" className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Submodule
                  </Button>

                  <div className="mt-4">
                    <h4 className="text-blue-800 dark:text-blue-100 mb-2">Resources</h4>
                    {module.resources.map((resource, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input 
                          value={resource.value} 
                          onChange={(e) => updateResource(module.id, index, resource.type, e.target.value)}
                          className="mr-2 bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100" 
                          placeholder={resource.type === 'link' ? 'Enter URL' : resource.type === 'youtube' ? 'Enter YouTube URL' : `${resource.type.toUpperCase()} file`}
                        />
                        <Button type="button" onClick={() => removeResource(module.id, index)} variant="outline" size="icon" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {resource.preview && (
                            <div className="ml-2">
                              {resource.type === 'pdf' ? (
                                <embed src={resource.preview} type="application/pdf" width="100" height="100" />
                              ) : resource.type === 'video' ? (
                                <video src={resource.preview} width="100" height="100" controls />
                              ) : null}
                            </div>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="mt-2" onClick={() => setSelectedResource(resource)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                                <DialogTitle>{resource.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                {resource.preview && (
                                  <div>
                                    {resource.type === 'pdf' ? (
                                      <embed src={resource.preview} type="application/pdf" width="100%" height="300" />
                                    ) : resource.type === 'video' ? (
                                      <video src={resource.preview} width="100%" height="auto" controls />
                                    ) : null}
                                  </div>
                                )}
                                <p className="mt-2">{resource.description}</p>
                              </div>
                            </DialogContent>
                          </Dialog>

                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Button type="button" onClick={() => addResource(module.id)} variant="outline" size="sm" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">
                        <Link className="mr-2 h-4 w-4" /> Add Link
                      </Button>
                      <div>
                      <Label htmlFor={`pdf-${module.id}`} className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
                          onClick={() => document.getElementById(`pdf-${module.id}`).click()} // Programmatically trigger the input click
                        >
                          <FilePdf className="mr-2 h-4 w-4" /> Upload PDF
                        </Button>
                      </Label>
                      <Input
                        id={`pdf-${module.id}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(module.id, e, 'pdf')}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`video-${module.id}`} className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
                          onClick={() => document.getElementById(`video-${module.id}`).click()} // Trigger the input click
                        >
                          <FileVideo className="mr-2 h-4 w-4" /> Upload Video
                        </Button>
                      </Label>
                      <Input
                        id={`video-${module.id}`}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(module.id, e, 'video')}
                      />
                    </div>

                      <Button type="button" onClick={() => addResource(module.id)} variant="outline" size="sm" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">
                        <FileVideo className="mr-2 h-4 w-4" /> Add YouTube Link
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Save Modules
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

