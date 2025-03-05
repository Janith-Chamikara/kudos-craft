using System;
using Avalonia.Controls;
using Avalonia.Controls.Templates;
using KudosCraft.ViewModels;

namespace KudosCraft;

public class ViewLocator : IDataTemplate
{
    public Control? Build(object? data)
    {
        if (data is null)
            return null;

        var name = data.GetType().FullName!.Replace("ViewModel", "View");
        var type = Type.GetType(name);

        if (type == null)
        {
            // Try to find the type in the KudosCraft.Views namespace
            name = name.Replace("KudosCraft.ViewModels", "KudosCraft.Views");
            type = Type.GetType(name);

            // If still not found, try to load the assembly and find the type
            if (type == null)
            {
                var assembly = System.Reflection.Assembly.GetExecutingAssembly();
                type = assembly.GetType(name);
            }
        }

        if (type != null)
        {
            return (Control)Activator.CreateInstance(type)!;
        }

        return new TextBlock { Text = "Not Found: " + name };
    }

    public bool Match(object? data)
    {
        return data is ViewModelBase;
    }
}
